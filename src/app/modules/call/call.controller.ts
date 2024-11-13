import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import generateAgoraToken from '../../helpers/generateAgoraToken';

const generateToken = catchAsync(async (req, res) => {

    const {duration, startTime, channelName} = req.body;
    const result = generateAgoraToken(channelName, startTime, duration)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Agora Token Generate successfully!',
        data: result
    });
});

export const CallController = {
    generateToken
}