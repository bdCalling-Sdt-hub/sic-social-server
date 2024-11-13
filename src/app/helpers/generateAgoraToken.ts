import { RtcTokenBuilder, RtcRole } from 'agora-token';
import config from '../config';

const generateAgoraToken = (channelName: string, startTime: string | Date, duration: number): string | undefined => {
    try {
        const appID = config.agora.app_id as string;
        const appCertificate = config.agora.app_certificate as string;
        const uid = 0; // Use UID from query parameter or default to 0
        const role = RtcRole.PUBLISHER; // Role of the user (publisher, subscriber)

        const expirationTimeInSeconds = duration * 60; // Token expiration time in seconds

        // Convert startTime to a timestamp in seconds (ensure it is in UTC)
        const currentTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
        const tokenExpireTs = currentTimestamp + expirationTimeInSeconds; // Token expiration time
        const privilegeExpireTs = tokenExpireTs; // Same expiration time for privileges (you can adjust if needed)

        // Build token
        const token = RtcTokenBuilder.buildTokenWithUid(
            appID,
            appCertificate,
            channelName,
            uid,
            role,
            tokenExpireTs,
            privilegeExpireTs
        );

        return token;
    }
    catch (error) {
        console.error('Error generating Agora token:', error);
        throw new Error('Failed to generate Agora token');
    }
};

export default generateAgoraToken;
