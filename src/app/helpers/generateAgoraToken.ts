import { RtcRole, RtcTokenBuilder } from 'agora-token';

import config from '../config';

const appID = config.agora.app_id as string;
const appCertificate = config.agora.app_certificate as string;

const generateAgoraToken = (
  chatId: string,
  role: string,
  userId: string,
): string => {
  try {
    const channelName = chatId;
    const uid = userId;

    // Debugging: Log inputs to ensure they are correct
    console.log('Channel Name:', channelName);
    console.log('Role:', role);
    console.log('UID:', uid);

    if (!channelName) {
      throw new Error('Room or Channel does not exist');
    }
    if (!role) {
      throw new Error('Role does not exist');
    }

    // Determine Agora role
    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpirationTime = 3600; // Token valid for 1 hour
    const privilegeExpirationTime = 3600; // Privilege valid for 1 hour
    const tokenExpireTimestamp = currentTimestamp + tokenExpirationTime;
    const privilegeExpireTimestamp = currentTimestamp + privilegeExpirationTime;

    // Build the Agora token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      agoraRole,
      tokenExpireTimestamp,
      privilegeExpireTimestamp,
    );

    return token;
  } catch (error) {
    console.error('Error generating Agora token:', error);
    throw new Error('Failed to generate Agora token');
  }
};

export default generateAgoraToken;
