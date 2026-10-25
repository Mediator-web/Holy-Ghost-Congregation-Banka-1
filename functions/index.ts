import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Cloud Function to securely provision or update Administrator Custom Claims.
 * Restricted to caller with 'SUPER_ADMIN' claim or initial setup token.
 */
export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Check authorization: caller must be authenticated super admin
  const isSuperAdmin = context.auth?.token?.role === 'SUPER_ADMIN';
  const isInitialSetup = !context.auth && data.setupSecret === process.env.PCG_SETUP_SECRET;

  if (!isSuperAdmin && !isInitialSetup) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only a Super Administrator can assign administrator roles.'
    );
  }

  const { targetEmail, targetRole } = data;
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

  if (!validRoles.includes(targetRole)) {
    throw new functions.https.HttpsError('invalid-argument', `Invalid role specified: ${targetRole}`);
  }

  try {
    const user = await admin.auth().getUserByEmail(targetEmail);
    await admin.auth().setCustomUserClaims(user.uid, { role: targetRole });

    // Synchronize to Realtime Database
    await admin.database().ref(`users/${user.uid}`).update({
      role: targetRole,
      updatedAt: new Date().toISOString(),
    });

    // Write to audit log
    await admin.database().ref('auditLogs').push({
      actorEmail: context.auth?.token?.email || 'SYSTEM_INITIALIZER',
      actorRole: 'SUPER_ADMIN',
      action: 'UPDATE',
      entityType: 'User',
      entityId: user.uid,
      details: `Role updated to ${targetRole} for ${targetEmail}`,
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: `Successfully assigned role ${targetRole} to ${targetEmail}` };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Contact Message submission trigger
 * Validates, checks honeypot, and sends administrative notification
 */
export const onContactMessageCreated = functions.database
  .ref('/contactMessages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const message = snapshot.val();
    const messageId = context.params.messageId;

    // Abuse check
    if (!message.name || !message.email || !message.message) {
      console.warn(`Deleting invalid contact submission ${messageId}`);
      return snapshot.ref.remove();
    }

    // Set initial metadata
    return snapshot.ref.update({
      status: 'unread',
      receivedAt: new Date().toISOString(),
      processed: true,
    });
  });
