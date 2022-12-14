// this file is auto-generated. do not edit it manually.

const TG_API_URL = "https://api.telegram.org/";
/**
 * Error returned from the telegram bot API.
 * Contains the error code and the description.
 */
export class TgError extends Error {
    /** HTTP status code returned by the telegram API */
    declare code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}
/**
 * Telegram bot options
 */
type TgBotOptions = {
    /**
     * Telegram bot token.
     * Talk to [BotFather](https://t.me/BotFather) to generate one.
     */
    token: string;
    /**
     * Telegram API URL.
     * Use this if you're hosting your own bot API server.
     * Default: https://api.telegram.org
     */
    url?: string;
    /**
     * Use custom {@link fetch} function instead of the global one.
     * Useful for testing or if your environment doesn't support fetch.
     */
    fetch?: (url: string, init: {
        method: "GET" | "POST";
        headers?: {
            "Content-Type": "application/json";
        };
        body?: string | FormData;
    }) => Promise<{
        status: number;
        statusText?: string;
        json: () => Promise<any>;
        blob: () => Promise<Blob>;
    }>;
    /**
     * Use custom {@link FormData} class instead of the global one.
     * This is only used in methods that send {@link File} or {@link Blob}.
     * Useful for testing or if your environment doesn't support FormData.
     */
    FormData?: typeof FormData;
};
export function initTgBot(options: TgBotOptions): TgBot {
    return new Proxy<TgBot>({} as TgBot, {
        get(target, prop) {
            if (prop == "downloadFile") {
                return (filePath: string) => botFileDownload(options, filePath);
            }
            if (typeof prop == "string") {
                return (params: unknown) => botMethodCall(options, prop, params);
            }
        },
    });
}
/**
 * Telegram bot client.
 */
export interface TgBot {
    /**
     * Download a file that you get from {@link TgBot.getFile}.
     * @see https://core.telegram.org/bots/api#getfile
     */
    downloadFile(filePath: string): Promise<Blob>;
}
async function botMethodCall(options: TgBotOptions, method: string, params: unknown) {
    const url = new URL(`./bot${options.token}/${method}`, options.url ?? TG_API_URL);
    let body, headers;
    if (params != null && typeof params == "object") {
        // If params contains a File or Blob, send it as multipart/form-data.
        if (Object.values(params).some((v) => v != null &&
            typeof v == "object" &&
            typeof v.arrayBuffer == "function")) {
            const FormData = options.FormData ?? globalThis.FormData;
            body = new FormData();
            for (const [key, value] of Object.entries(params)) {
                if (typeof value == "string" || typeof value == "number") {
                    body.set(key, String(value));
                }
                else if (value != null &&
                    typeof value == "object" &&
                    typeof value.arrayBuffer == "function") {
                    body.set(key, value as Blob);
                }
                else if (value != null && value !== false) {
                    body.set(key, JSON.stringify(value));
                }
            }
        }
        // If params contains only strings or numbers, send it in query string.
        else if (Object.values(params).every((v) => typeof v == "string" ||
            typeof v == "number" ||
            typeof v == "boolean" ||
            v == null)) {
            for (const [key, value] of Object.entries(params)) {
                if (value != null && value !== false) {
                    url.searchParams.set(key, String(value));
                }
            }
        }
        // Otherwise, send params as JSON.
        else {
            headers = { "Content-Type": "application/json" } as const;
            body = JSON.stringify(params);
        }
    }
    const fetch = options.fetch ?? globalThis.fetch;
    const response = await fetch(url.href, { method: "POST", headers, body });
    const data = await response.json().catch(() => null);
    if (data?.ok === true) {
        return data.result;
    }
    if (data?.ok === false) {
        throw new TgError(data.description, data.error_code);
    }
    if (response.status >= 400) {
        throw new TgError(response.statusText ?? `Error ${response.status}`, response.status);
    }
    throw new TgError("Invalid response", response.status);
}
async function botFileDownload(options: TgBotOptions, filePath: string) {
    const url = new URL(`./file/bot${options.token}/${filePath}`, options.url ?? TG_API_URL);
    const fetch = options.fetch ?? globalThis.fetch;
    const response = await fetch(url.href, {
        method: "GET",
        mode: "no-cors",
        credentials: "omit",
    });
    if (response.status >= 400) {
        throw new TgError(response.statusText ?? `Error ${response.status}`, response.status);
    }
    const blob = await response.blob();
    return blob;
}
export interface TgBot {
    /**
     * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
     * @see https://core.telegram.org/bots/api#getupdates
     */
    getUpdates(params: TgGetUpdatesParams): Promise<TgUpdate[]>;
    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success.
     * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header "X-Telegram-Bot-Api-Secret-Token" with the secret token as content.
     * @see https://core.telegram.org/bots/api#setwebhook
     */
    setWebhook(params: TgSetWebhookParams): Promise<boolean>;
    /**
     * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.
     * @see https://core.telegram.org/bots/api#deletewebhook
     */
    deleteWebhook(params: TgDeleteWebhookParams): Promise<boolean>;
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
     * @see https://core.telegram.org/bots/api#getwebhookinfo
     */
    getWebhookInfo(): Promise<TgWebhookInfo>;
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.
     * @see https://core.telegram.org/bots/api#getme
     */
    getMe(): Promise<TgUser>;
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.
     * @see https://core.telegram.org/bots/api#logout
     */
    logOut(): Promise<boolean>;
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.
     * @see https://core.telegram.org/bots/api#close
     */
    close(): Promise<boolean>;
    /**
     * Use this method to send text messages. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendmessage
     */
    sendMessage(params: TgSendMessageParams): Promise<TgMessage>;
    /**
     * Use this method to forward messages of any kind. Service messages can't be forwarded. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#forwardmessage
     */
    forwardMessage(params: TgForwardMessageParams): Promise<TgMessage>;
    /**
     * Use this method to copy messages of any kind. Service messages and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     * @see https://core.telegram.org/bots/api#copymessage
     */
    copyMessage(params: TgCopyMessageParams): Promise<TgMessageId>;
    /**
     * Use this method to send photos. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendphoto
     */
    sendPhoto(params: TgSendPhotoParams): Promise<TgMessage>;
    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the sendVoice method instead.
     * @see https://core.telegram.org/bots/api#sendaudio
     */
    sendAudio(params: TgSendAudioParams): Promise<TgMessage>;
    /**
     * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * @see https://core.telegram.org/bots/api#senddocument
     */
    sendDocument(params: TgSendDocumentParams): Promise<TgMessage>;
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * @see https://core.telegram.org/bots/api#sendvideo
     */
    sendVideo(params: TgSendVideoParams): Promise<TgMessage>;
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     * @see https://core.telegram.org/bots/api#sendanimation
     */
    sendAnimation(params: TgSendAnimationParams): Promise<TgMessage>;
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     * @see https://core.telegram.org/bots/api#sendvoice
     */
    sendVoice(params: TgSendVoiceParams): Promise<TgMessage>;
    /**
     * As of v.4.0, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendvideonote
     */
    sendVideoNote(params: TgSendVideoNoteParams): Promise<TgMessage>;
    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of Messages that were sent is returned.
     * @see https://core.telegram.org/bots/api#sendmediagroup
     */
    sendMediaGroup(params: TgSendMediaGroupParams): Promise<TgMessage[]>;
    /**
     * Use this method to send point on the map. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendlocation
     */
    sendLocation(params: TgSendLocationParams): Promise<TgMessage>;
    /**
     * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#editmessagelivelocation
     */
    editMessageLiveLocation(params: TgEditMessageLiveLocationParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#stopmessagelivelocation
     */
    stopMessageLiveLocation(params: TgStopMessageLiveLocationParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to send information about a venue. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendvenue
     */
    sendVenue(params: TgSendVenueParams): Promise<TgMessage>;
    /**
     * Use this method to send phone contacts. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendcontact
     */
    sendContact(params: TgSendContactParams): Promise<TgMessage>;
    /**
     * Use this method to send a native poll. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendpoll
     */
    sendPoll(params: TgSendPollParams): Promise<TgMessage>;
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#senddice
     */
    sendDice(params: TgSendDiceParams): Promise<TgMessage>;
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     * @see https://core.telegram.org/bots/api#sendchataction
     */
    sendChatAction(params: TgSendChatActionParams): Promise<boolean>;
    /**
     * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     * @see https://core.telegram.org/bots/api#getuserprofilephotos
     */
    getUserProfilePhotos(params: TgGetUserProfilePhotosParams): Promise<TgUserProfilePhotos>;
    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
     * Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     * @see https://core.telegram.org/bots/api#getfile
     */
    getFile(params: TgGetFileParams): Promise<TgFile>;
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#banchatmember
     */
    banChatMember(params: TgBanChatMemberParams): Promise<boolean>;
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     * @see https://core.telegram.org/bots/api#unbanchatmember
     */
    unbanChatMember(params: TgUnbanChatMemberParams): Promise<boolean>;
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     * @see https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictChatMember(params: TgRestrictChatMemberParams): Promise<boolean>;
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     * @see https://core.telegram.org/bots/api#promotechatmember
     */
    promoteChatMember(params: TgPromoteChatMemberParams): Promise<boolean>;
    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorCustomTitle(params: TgSetChatAdministratorCustomTitleParams): Promise<boolean>;
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#banchatsenderchat
     */
    banChatSenderChat(params: TgBanChatSenderChatParams): Promise<boolean>;
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#unbanchatsenderchat
     */
    unbanChatSenderChat(params: TgUnbanChatSenderChatParams): Promise<boolean>;
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatpermissions
     */
    setChatPermissions(params: TgSetChatPermissionsParams): Promise<boolean>;
    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     * @see https://core.telegram.org/bots/api#exportchatinvitelink
     */
    exportChatInviteLink(params: TgExportChatInviteLinkParams): Promise<string>;
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     * @see https://core.telegram.org/bots/api#createchatinvitelink
     */
    createChatInviteLink(params: TgCreateChatInviteLinkParams): Promise<TgChatInviteLink>;
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     * @see https://core.telegram.org/bots/api#editchatinvitelink
     */
    editChatInviteLink(params: TgEditChatInviteLinkParams): Promise<TgChatInviteLink>;
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     * @see https://core.telegram.org/bots/api#revokechatinvitelink
     */
    revokeChatInviteLink(params: TgRevokeChatInviteLinkParams): Promise<TgChatInviteLink>;
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     * @see https://core.telegram.org/bots/api#approvechatjoinrequest
     */
    approveChatJoinRequest(params: TgApproveChatJoinRequestParams): Promise<boolean>;
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     * @see https://core.telegram.org/bots/api#declinechatjoinrequest
     */
    declineChatJoinRequest(params: TgDeclineChatJoinRequestParams): Promise<boolean>;
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatphoto
     */
    setChatPhoto(params: TgSetChatPhotoParams): Promise<boolean>;
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#deletechatphoto
     */
    deleteChatPhoto(params: TgDeleteChatPhotoParams): Promise<boolean>;
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchattitle
     */
    setChatTitle(params: TgSetChatTitleParams): Promise<boolean>;
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatdescription
     */
    setChatDescription(params: TgSetChatDescriptionParams): Promise<boolean>;
    /**
     * Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     * @see https://core.telegram.org/bots/api#pinchatmessage
     */
    pinChatMessage(params: TgPinChatMessageParams): Promise<boolean>;
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     * @see https://core.telegram.org/bots/api#unpinchatmessage
     */
    unpinChatMessage(params: TgUnpinChatMessageParams): Promise<boolean>;
    /**
     * Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     * @see https://core.telegram.org/bots/api#unpinallchatmessages
     */
    unpinAllChatMessages(params: TgUnpinAllChatMessagesParams): Promise<boolean>;
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
     * @see https://core.telegram.org/bots/api#leavechat
     */
    leaveChat(params: TgLeaveChatParams): Promise<boolean>;
    /**
     * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     * @see https://core.telegram.org/bots/api#getchat
     */
    getChat(params: TgGetChatParams): Promise<TgChat>;
    /**
     * Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of ChatMember objects.
     * @see https://core.telegram.org/bots/api#getchatadministrators
     */
    getChatAdministrators(params: TgGetChatAdministratorsParams): Promise<TgChatMember[]>;
    /**
     * Use this method to get the number of members in a chat. Returns Int on success.
     * @see https://core.telegram.org/bots/api#getchatmembercount
     */
    getChatMemberCount(params: TgGetChatMemberCountParams): Promise<number>;
    /**
     * Use this method to get information about a member of a chat. Returns a ChatMember object on success.
     * @see https://core.telegram.org/bots/api#getchatmember
     */
    getChatMember(params: TgGetChatMemberParams): Promise<TgChatMember>;
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatstickerset
     */
    setChatStickerSet(params: TgSetChatStickerSetParams): Promise<boolean>;
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @see https://core.telegram.org/bots/api#deletechatstickerset
     */
    deleteChatStickerSet(params: TgDeleteChatStickerSetParams): Promise<boolean>;
    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     * @see https://core.telegram.org/bots/api#answercallbackquery
     */
    answerCallbackQuery(params: TgAnswerCallbackQueryParams): Promise<boolean>;
    /**
     * Use this method to change the list of the bot's commands. See https://core.telegram.org/bots#commands for more details about bot commands. Returns True on success.
     * @see https://core.telegram.org/bots/api#setmycommands
     */
    setMyCommands(params: TgSetMyCommandsParams): Promise<boolean>;
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.
     * @see https://core.telegram.org/bots/api#deletemycommands
     */
    deleteMyCommands(params: TgDeleteMyCommandsParams): Promise<boolean>;
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.
     * @see https://core.telegram.org/bots/api#getmycommands
     */
    getMyCommands(params: TgGetMyCommandsParams): Promise<TgBotCommand[]>;
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
     * @see https://core.telegram.org/bots/api#setchatmenubutton
     */
    setChatMenuButton(params: TgSetChatMenuButtonParams): Promise<boolean>;
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
     * @see https://core.telegram.org/bots/api#getchatmenubutton
     */
    getChatMenuButton(params: TgGetChatMenuButtonParams): Promise<TgMenuButton>;
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are are free to modify the list before adding the bot. Returns True on success.
     * @see https://core.telegram.org/bots/api#setmydefaultadministratorrights
     */
    setMyDefaultAdministratorRights(params: TgSetMyDefaultAdministratorRightsParams): Promise<boolean>;
    /**
     * Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
     * @see https://core.telegram.org/bots/api#getmydefaultadministratorrights
     */
    getMyDefaultAdministratorRights(params: TgGetMyDefaultAdministratorRightsParams): Promise<TgChatAdministratorRights>;
    /**
     * Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#editmessagetext
     */
    editMessageText(params: TgEditMessageTextParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#editmessagecaption
     */
    editMessageCaption(params: TgEditMessageCaptionParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#editmessagemedia
     */
    editMessageMedia(params: TgEditMessageMediaParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     * @see https://core.telegram.org/bots/api#editmessagereplymarkup
     */
    editMessageReplyMarkup(params: TgEditMessageReplyMarkupParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
     * @see https://core.telegram.org/bots/api#stoppoll
     */
    stopPoll(params: TgStopPollParams): Promise<TgPoll>;
    /**
     * Use this method to delete a message, including service messages, with the following limitations:
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     * - Bots can delete outgoing messages in private chats, groups, and supergroups.
     * - Bots can delete incoming messages in private chats.
     * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     * Returns True on success.
     * @see https://core.telegram.org/bots/api#deletemessage
     */
    deleteMessage(params: TgDeleteMessageParams): Promise<boolean>;
    /**
     * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendsticker
     */
    sendSticker(params: TgSendStickerParams): Promise<TgMessage>;
    /**
     * Use this method to get a sticker set. On success, a StickerSet object is returned.
     * @see https://core.telegram.org/bots/api#getstickerset
     */
    getStickerSet(params: TgGetStickerSetParams): Promise<TgStickerSet>;
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     * @see https://core.telegram.org/bots/api#getcustomemojistickers
     */
    getCustomEmojiStickers(params: TgGetCustomEmojiStickersParams): Promise<TgSticker[]>;
    /**
     * Use this method to upload a .PNG file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times). Returns the uploaded File on success.
     * @see https://core.telegram.org/bots/api#uploadstickerfile
     */
    uploadStickerFile(params: TgUploadStickerFileParams): Promise<TgFile>;
    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. You must use exactly one of the fields png_sticker, tgs_sticker, or webm_sticker. Returns True on success.
     * @see https://core.telegram.org/bots/api#createnewstickerset
     */
    createNewStickerSet(params: TgCreateNewStickerSetParams): Promise<boolean>;
    /**
     * Use this method to add a new sticker to a set created by the bot. You must use exactly one of the fields png_sticker, tgs_sticker, or webm_sticker. Animated stickers can be added to animated sticker sets and only to them. Animated sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers. Returns True on success.
     * @see https://core.telegram.org/bots/api#addstickertoset
     */
    addStickerToSet(params: TgAddStickerToSetParams): Promise<boolean>;
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
     * @see https://core.telegram.org/bots/api#setstickerpositioninset
     */
    setStickerPositionInSet(params: TgSetStickerPositionInSetParams): Promise<boolean>;
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns True on success.
     * @see https://core.telegram.org/bots/api#deletestickerfromset
     */
    deleteStickerFromSet(params: TgDeleteStickerFromSetParams): Promise<boolean>;
    /**
     * Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only. Video thumbnails can be set only for video sticker sets only. Returns True on success.
     * @see https://core.telegram.org/bots/api#setstickersetthumb
     */
    setStickerSetThumb(params: TgSetStickerSetThumbParams): Promise<boolean>;
    /**
     * Use this method to send answers to an inline query. On success, True is returned.
     * No more than 50 results per query are allowed.
     * @see https://core.telegram.org/bots/api#answerinlinequery
     */
    answerInlineQuery(params: TgAnswerInlineQueryParams): Promise<boolean>;
    /**
     * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.
     * @see https://core.telegram.org/bots/api#answerwebappquery
     */
    answerWebAppQuery(params: TgAnswerWebAppQueryParams): Promise<TgSentWebAppMessage>;
    /**
     * Use this method to send invoices. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendinvoice
     */
    sendInvoice(params: TgSendInvoiceParams): Promise<TgMessage>;
    /**
     * Use this method to create a link for an invoice. Returns the created invoice link as String on success.
     * @see https://core.telegram.org/bots/api#createinvoicelink
     */
    createInvoiceLink(params: TgCreateInvoiceLinkParams): Promise<string>;
    /**
     * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
     * @see https://core.telegram.org/bots/api#answershippingquery
     */
    answerShippingQuery(params: TgAnswerShippingQueryParams): Promise<boolean>;
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     * @see https://core.telegram.org/bots/api#answerprecheckoutquery
     */
    answerPreCheckoutQuery(params: TgAnswerPreCheckoutQueryParams): Promise<boolean>;
    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     * @see https://core.telegram.org/bots/api#setpassportdataerrors
     */
    setPassportDataErrors(params: TgSetPassportDataErrorsParams): Promise<boolean>;
    /**
     * Use this method to send a game. On success, the sent Message is returned.
     * @see https://core.telegram.org/bots/api#sendgame
     */
    sendGame(params: TgSendGameParams): Promise<TgMessage>;
    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
     * @see https://core.telegram.org/bots/api#setgamescore
     */
    setGameScore(params: TgSetGameScoreParams): Promise<TgMessage | boolean>;
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.
     * @see https://core.telegram.org/bots/api#getgamehighscores
     */
    getGameHighScores(params: TgGetGameHighScoresParams): Promise<TgGameHighScore[]>;
}
/**
 * Parameters of {@link TgBot.getUpdates} method.
 * @see https://core.telegram.org/bots/api#getupdates
 */
export type TgGetUpdatesParams = {
    /**
     * Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten.
     *  */
    offset?: number;
    /**
     * Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     *  */
    limit?: number;
    /**
     * Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
     *  */
    timeout?: number;
    /**
     * A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time.
     *  */
    allowed_updates?: string[];
};
/**
 * Parameters of {@link TgBot.setWebhook} method.
 * @see https://core.telegram.org/bots/api#setwebhook
 */
export type TgSetWebhookParams = {
    /**
     * HTTPS URL to send updates to. Use an empty string to remove webhook integration
     *  */
    url: string;
    /**
     * Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.
     *  */
    certificate?: TgInputFile;
    /**
     * The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
     *  */
    ip_address?: string;
    /**
     * The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput.
     *  */
    max_connections?: number;
    /**
     * A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.
     *  */
    allowed_updates?: string[];
    /**
     * Pass True to drop all pending updates
     *  */
    drop_pending_updates?: boolean;
    /**
     * A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you.
     *  */
    secret_token?: string;
};
/**
 * Parameters of {@link TgBot.deleteWebhook} method.
 * @see https://core.telegram.org/bots/api#deletewebhook
 */
export type TgDeleteWebhookParams = {
    /**
     * Pass True to drop all pending updates
     *  */
    drop_pending_updates?: boolean;
};
/**
 * Parameters of {@link TgBot.sendMessage} method.
 * @see https://core.telegram.org/bots/api#sendmessage
 */
export type TgSendMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Text of the message to be sent, 1-4096 characters after entities parsing
     *  */
    text: string;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     *  */
    entities?: TgMessageEntity[];
    /**
     * Disables link previews for links in this message
     *  */
    disable_web_page_preview?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.forwardMessage} method.
 * @see https://core.telegram.org/bots/api#forwardmessage
 */
export type TgForwardMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     *  */
    from_chat_id: number | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the forwarded message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * Message identifier in the chat specified in from_chat_id
     *  */
    message_id: number;
};
/**
 * Parameters of {@link TgBot.copyMessage} method.
 * @see https://core.telegram.org/bots/api#copymessage
 */
export type TgCopyMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     *  */
    from_chat_id: number | string;
    /**
     * Message identifier in the chat specified in from_chat_id
     *  */
    message_id: number;
    /**
     * New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the new caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendPhoto} method.
 * @see https://core.telegram.org/bots/api#sendphoto
 */
export type TgSendPhotoParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    photo: TgInputFile | string;
    /**
     * Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the photo caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendAudio} method.
 * @see https://core.telegram.org/bots/api#sendaudio
 */
export type TgSendAudioParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    audio: TgInputFile | string;
    /**
     * Audio caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the audio caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Duration of the audio in seconds
     *  */
    duration?: number;
    /**
     * Performer
     *  */
    performer?: string;
    /**
     * Track name
     *  */
    title?: string;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendDocument} method.
 * @see https://core.telegram.org/bots/api#senddocument
 */
export type TgSendDocumentParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    document: TgInputFile | string;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the document caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Disables automatic server-side content type detection for files uploaded using multipart/form-data
     *  */
    disable_content_type_detection?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendVideo} method.
 * @see https://core.telegram.org/bots/api#sendvideo
 */
export type TgSendVideoParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    video: TgInputFile | string;
    /**
     * Duration of sent video in seconds
     *  */
    duration?: number;
    /**
     * Video width
     *  */
    width?: number;
    /**
     * Video height
     *  */
    height?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the video caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Pass True if the uploaded video is suitable for streaming
     *  */
    supports_streaming?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendAnimation} method.
 * @see https://core.telegram.org/bots/api#sendanimation
 */
export type TgSendAnimationParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    animation: TgInputFile | string;
    /**
     * Duration of sent animation in seconds
     *  */
    duration?: number;
    /**
     * Animation width
     *  */
    width?: number;
    /**
     * Animation height
     *  */
    height?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the animation caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendVoice} method.
 * @see https://core.telegram.org/bots/api#sendvoice
 */
export type TgSendVoiceParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    voice: TgInputFile | string;
    /**
     * Voice message caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the voice message caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Duration of the voice message in seconds
     *  */
    duration?: number;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendVideoNote} method.
 * @see https://core.telegram.org/bots/api#sendvideonote
 */
export type TgSendVideoNoteParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending video notes by a URL is currently unsupported
     *  */
    video_note: TgInputFile | string;
    /**
     * Duration of sent video in seconds
     *  */
    duration?: number;
    /**
     * Video width and height, i.e. diameter of the video message
     *  */
    length?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendMediaGroup} method.
 * @see https://core.telegram.org/bots/api#sendmediagroup
 */
export type TgSendMediaGroupParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * A JSON-serialized array describing messages to be sent, must include 2-10 items
     *  */
    media: TgInputMediaAudio[] | TgInputMediaDocument[] | TgInputMediaPhoto[] | TgInputMediaVideo[];
    /**
     * Sends messages silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent messages from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the messages are a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
};
/**
 * Parameters of {@link TgBot.sendLocation} method.
 * @see https://core.telegram.org/bots/api#sendlocation
 */
export type TgSendLocationParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Latitude of the location
     *  */
    latitude: number;
    /**
     * Longitude of the location
     *  */
    longitude: number;
    /**
     * The radius of uncertainty for the location, measured in meters; 0-1500
     *  */
    horizontal_accuracy?: number;
    /**
     * Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
     *  */
    live_period?: number;
    /**
     * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     *  */
    heading?: number;
    /**
     * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     *  */
    proximity_alert_radius?: number;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.editMessageLiveLocation} method.
 * @see https://core.telegram.org/bots/api#editmessagelivelocation
 */
export type TgEditMessageLiveLocationParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * Latitude of new location
     *  */
    latitude: number;
    /**
     * Longitude of new location
     *  */
    longitude: number;
    /**
     * The radius of uncertainty for the location, measured in meters; 0-1500
     *  */
    horizontal_accuracy?: number;
    /**
     * Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     *  */
    heading?: number;
    /**
     * The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     *  */
    proximity_alert_radius?: number;
    /**
     * A JSON-serialized object for a new inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.stopMessageLiveLocation} method.
 * @see https://core.telegram.org/bots/api#stopmessagelivelocation
 */
export type TgStopMessageLiveLocationParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message with live location to stop
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for a new inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.sendVenue} method.
 * @see https://core.telegram.org/bots/api#sendvenue
 */
export type TgSendVenueParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Latitude of the venue
     *  */
    latitude: number;
    /**
     * Longitude of the venue
     *  */
    longitude: number;
    /**
     * Name of the venue
     *  */
    title: string;
    /**
     * Address of the venue
     *  */
    address: string;
    /**
     * Foursquare identifier of the venue
     *  */
    foursquare_id?: string;
    /**
     * Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
     *  */
    foursquare_type?: string;
    /**
     * Google Places identifier of the venue
     *  */
    google_place_id?: string;
    /**
     * Google Places type of the venue. (See supported types.)
     *  */
    google_place_type?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendContact} method.
 * @see https://core.telegram.org/bots/api#sendcontact
 */
export type TgSendContactParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Contact's phone number
     *  */
    phone_number: string;
    /**
     * Contact's first name
     *  */
    first_name: string;
    /**
     * Contact's last name
     *  */
    last_name?: string;
    /**
     * Additional data about the contact in the form of a vCard, 0-2048 bytes
     *  */
    vcard?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendPoll} method.
 * @see https://core.telegram.org/bots/api#sendpoll
 */
export type TgSendPollParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Poll question, 1-300 characters
     *  */
    question: string;
    /**
     * A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
     *  */
    options: string[];
    /**
     * True, if the poll needs to be anonymous, defaults to True
     *  */
    is_anonymous?: boolean;
    /**
     * Poll type, "quiz" or "regular", defaults to "regular"
     *  */
    type?: string;
    /**
     * True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
     *  */
    allows_multiple_answers?: boolean;
    /**
     * 0-based identifier of the correct answer option, required for polls in quiz mode
     *  */
    correct_option_id?: number;
    /**
     * Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
     *  */
    explanation?: string;
    /**
     * Mode for parsing entities in the explanation. See formatting options for more details.
     *  */
    explanation_parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the poll explanation, which can be specified instead of parse_mode
     *  */
    explanation_entities?: TgMessageEntity[];
    /**
     * Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date.
     *  */
    open_period?: number;
    /**
     * Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period.
     *  */
    close_date?: number;
    /**
     * Pass True if the poll needs to be immediately closed. This can be useful for poll preview.
     *  */
    is_closed?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendDice} method.
 * @see https://core.telegram.org/bots/api#senddice
 */
export type TgSendDiceParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Emoji on which the dice throw animation is based. Currently, must be one of "????", "????", "????", "???", "????", or "????". Dice can have values 1-6 for "????", "????" and "????", values 1-5 for "????" and "???", and values 1-64 for "????". Defaults to "????"
     *  */
    emoji?: "\uD83C\uDFB2" | "\uD83C\uDFAF" | "\uD83C\uDFC0" | "\u26BD" | "\uD83C\uDFB3" | "\uD83C\uDFB0";
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.sendChatAction} method.
 * @see https://core.telegram.org/bots/api#sendchataction
 */
export type TgSendChatActionParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.
     *  */
    action: string;
};
/**
 * Parameters of {@link TgBot.getUserProfilePhotos} method.
 * @see https://core.telegram.org/bots/api#getuserprofilephotos
 */
export type TgGetUserProfilePhotosParams = {
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * Sequential number of the first photo to be returned. By default, all photos are returned.
     *  */
    offset?: number;
    /**
     * Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     *  */
    limit?: number;
};
/**
 * Parameters of {@link TgBot.getFile} method.
 * @see https://core.telegram.org/bots/api#getfile
 */
export type TgGetFileParams = {
    /**
     * File identifier to get information about
     *  */
    file_id: string;
};
/**
 * Parameters of {@link TgBot.banChatMember} method.
 * @see https://core.telegram.org/bots/api#banchatmember
 */
export type TgBanChatMemberParams = {
    /**
     * Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.
     *  */
    until_date?: number;
    /**
     * Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.
     *  */
    revoke_messages?: boolean;
};
/**
 * Parameters of {@link TgBot.unbanChatMember} method.
 * @see https://core.telegram.org/bots/api#unbanchatmember
 */
export type TgUnbanChatMemberParams = {
    /**
     * Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * Do nothing if the user is not banned
     *  */
    only_if_banned?: boolean;
};
/**
 * Parameters of {@link TgBot.restrictChatMember} method.
 * @see https://core.telegram.org/bots/api#restrictchatmember
 */
export type TgRestrictChatMemberParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * A JSON-serialized object for new user permissions
     *  */
    permissions: TgChatPermissions;
    /**
     * Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
     *  */
    until_date?: number;
};
/**
 * Parameters of {@link TgBot.promoteChatMember} method.
 * @see https://core.telegram.org/bots/api#promotechatmember
 */
export type TgPromoteChatMemberParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * Pass True if the administrator's presence in the chat is hidden
     *  */
    is_anonymous?: boolean;
    /**
     * Pass True if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege
     *  */
    can_manage_chat?: boolean;
    /**
     * Pass True if the administrator can create channel posts, channels only
     *  */
    can_post_messages?: boolean;
    /**
     * Pass True if the administrator can edit messages of other users and can pin messages, channels only
     *  */
    can_edit_messages?: boolean;
    /**
     * Pass True if the administrator can delete messages of other users
     *  */
    can_delete_messages?: boolean;
    /**
     * Pass True if the administrator can manage video chats
     *  */
    can_manage_video_chats?: boolean;
    /**
     * Pass True if the administrator can restrict, ban or unban chat members
     *  */
    can_restrict_members?: boolean;
    /**
     * Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
     *  */
    can_promote_members?: boolean;
    /**
     * Pass True if the administrator can change chat title, photo and other settings
     *  */
    can_change_info?: boolean;
    /**
     * Pass True if the administrator can invite new users to the chat
     *  */
    can_invite_users?: boolean;
    /**
     * Pass True if the administrator can pin messages, supergroups only
     *  */
    can_pin_messages?: boolean;
};
/**
 * Parameters of {@link TgBot.setChatAdministratorCustomTitle} method.
 * @see https://core.telegram.org/bots/api#setchatadministratorcustomtitle
 */
export type TgSetChatAdministratorCustomTitleParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
    /**
     * New custom title for the administrator; 0-16 characters, emoji are not allowed
     *  */
    custom_title: string;
};
/**
 * Parameters of {@link TgBot.banChatSenderChat} method.
 * @see https://core.telegram.org/bots/api#banchatsenderchat
 */
export type TgBanChatSenderChatParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target sender chat
     *  */
    sender_chat_id: number;
};
/**
 * Parameters of {@link TgBot.unbanChatSenderChat} method.
 * @see https://core.telegram.org/bots/api#unbanchatsenderchat
 */
export type TgUnbanChatSenderChatParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target sender chat
     *  */
    sender_chat_id: number;
};
/**
 * Parameters of {@link TgBot.setChatPermissions} method.
 * @see https://core.telegram.org/bots/api#setchatpermissions
 */
export type TgSetChatPermissionsParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
    /**
     * A JSON-serialized object for new default chat permissions
     *  */
    permissions: TgChatPermissions;
};
/**
 * Parameters of {@link TgBot.exportChatInviteLink} method.
 * @see https://core.telegram.org/bots/api#exportchatinvitelink
 */
export type TgExportChatInviteLinkParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.createChatInviteLink} method.
 * @see https://core.telegram.org/bots/api#createchatinvitelink
 */
export type TgCreateChatInviteLinkParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Invite link name; 0-32 characters
     *  */
    name?: string;
    /**
     * Point in time (Unix timestamp) when the link will expire
     *  */
    expire_date?: number;
    /**
     * The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     *  */
    member_limit?: number;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified
     *  */
    creates_join_request?: boolean;
};
/**
 * Parameters of {@link TgBot.editChatInviteLink} method.
 * @see https://core.telegram.org/bots/api#editchatinvitelink
 */
export type TgEditChatInviteLinkParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * The invite link to edit
     *  */
    invite_link: string;
    /**
     * Invite link name; 0-32 characters
     *  */
    name?: string;
    /**
     * Point in time (Unix timestamp) when the link will expire
     *  */
    expire_date?: number;
    /**
     * The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     *  */
    member_limit?: number;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified
     *  */
    creates_join_request?: boolean;
};
/**
 * Parameters of {@link TgBot.revokeChatInviteLink} method.
 * @see https://core.telegram.org/bots/api#revokechatinvitelink
 */
export type TgRevokeChatInviteLinkParams = {
    /**
     * Unique identifier of the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * The invite link to revoke
     *  */
    invite_link: string;
};
/**
 * Parameters of {@link TgBot.approveChatJoinRequest} method.
 * @see https://core.telegram.org/bots/api#approvechatjoinrequest
 */
export type TgApproveChatJoinRequestParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
};
/**
 * Parameters of {@link TgBot.declineChatJoinRequest} method.
 * @see https://core.telegram.org/bots/api#declinechatjoinrequest
 */
export type TgDeclineChatJoinRequestParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
};
/**
 * Parameters of {@link TgBot.setChatPhoto} method.
 * @see https://core.telegram.org/bots/api#setchatphoto
 */
export type TgSetChatPhotoParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * New chat photo, uploaded using multipart/form-data
     *  */
    photo: TgInputFile;
};
/**
 * Parameters of {@link TgBot.deleteChatPhoto} method.
 * @see https://core.telegram.org/bots/api#deletechatphoto
 */
export type TgDeleteChatPhotoParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.setChatTitle} method.
 * @see https://core.telegram.org/bots/api#setchattitle
 */
export type TgSetChatTitleParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * New chat title, 1-255 characters
     *  */
    title: string;
};
/**
 * Parameters of {@link TgBot.setChatDescription} method.
 * @see https://core.telegram.org/bots/api#setchatdescription
 */
export type TgSetChatDescriptionParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * New chat description, 0-255 characters
     *  */
    description?: string;
};
/**
 * Parameters of {@link TgBot.pinChatMessage} method.
 * @see https://core.telegram.org/bots/api#pinchatmessage
 */
export type TgPinChatMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Identifier of a message to pin
     *  */
    message_id: number;
    /**
     * Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.
     *  */
    disable_notification?: boolean;
};
/**
 * Parameters of {@link TgBot.unpinChatMessage} method.
 * @see https://core.telegram.org/bots/api#unpinchatmessage
 */
export type TgUnpinChatMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
     *  */
    message_id?: number;
};
/**
 * Parameters of {@link TgBot.unpinAllChatMessages} method.
 * @see https://core.telegram.org/bots/api#unpinallchatmessages
 */
export type TgUnpinAllChatMessagesParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.leaveChat} method.
 * @see https://core.telegram.org/bots/api#leavechat
 */
export type TgLeaveChatParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.getChat} method.
 * @see https://core.telegram.org/bots/api#getchat
 */
export type TgGetChatParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.getChatAdministrators} method.
 * @see https://core.telegram.org/bots/api#getchatadministrators
 */
export type TgGetChatAdministratorsParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.getChatMemberCount} method.
 * @see https://core.telegram.org/bots/api#getchatmembercount
 */
export type TgGetChatMemberCountParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.getChatMember} method.
 * @see https://core.telegram.org/bots/api#getchatmember
 */
export type TgGetChatMemberParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
};
/**
 * Parameters of {@link TgBot.setChatStickerSet} method.
 * @see https://core.telegram.org/bots/api#setchatstickerset
 */
export type TgSetChatStickerSetParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
    /**
     * Name of the sticker set to be set as the group sticker set
     *  */
    sticker_set_name: string;
};
/**
 * Parameters of {@link TgBot.deleteChatStickerSet} method.
 * @see https://core.telegram.org/bots/api#deletechatstickerset
 */
export type TgDeleteChatStickerSetParams = {
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
};
/**
 * Parameters of {@link TgBot.answerCallbackQuery} method.
 * @see https://core.telegram.org/bots/api#answercallbackquery
 */
export type TgAnswerCallbackQueryParams = {
    /**
     * Unique identifier for the query to be answered
     *  */
    callback_query_id: string;
    /**
     * Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
     *  */
    text?: string;
    /**
     * If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
     *  */
    show_alert?: boolean;
    /**
     * URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
     *  */
    url?: string;
    /**
     * The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.
     *  */
    cache_time?: number;
};
/**
 * Parameters of {@link TgBot.setMyCommands} method.
 * @see https://core.telegram.org/bots/api#setmycommands
 */
export type TgSetMyCommandsParams = {
    /**
     * A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     *  */
    commands: TgBotCommand[];
    /**
     * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
     *  */
    scope?: TgBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
     *  */
    language_code?: string;
};
/**
 * Parameters of {@link TgBot.deleteMyCommands} method.
 * @see https://core.telegram.org/bots/api#deletemycommands
 */
export type TgDeleteMyCommandsParams = {
    /**
     * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
     *  */
    scope?: TgBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
     *  */
    language_code?: string;
};
/**
 * Parameters of {@link TgBot.getMyCommands} method.
 * @see https://core.telegram.org/bots/api#getmycommands
 */
export type TgGetMyCommandsParams = {
    /**
     * A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.
     *  */
    scope?: TgBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code or an empty string
     *  */
    language_code?: string;
};
/**
 * Parameters of {@link TgBot.setChatMenuButton} method.
 * @see https://core.telegram.org/bots/api#setchatmenubutton
 */
export type TgSetChatMenuButtonParams = {
    /**
     * Unique identifier for the target private chat. If not specified, default bot's menu button will be changed
     *  */
    chat_id?: number;
    /**
     * A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault
     *  */
    menu_button?: TgMenuButton;
};
/**
 * Parameters of {@link TgBot.getChatMenuButton} method.
 * @see https://core.telegram.org/bots/api#getchatmenubutton
 */
export type TgGetChatMenuButtonParams = {
    /**
     * Unique identifier for the target private chat. If not specified, default bot's menu button will be returned
     *  */
    chat_id?: number;
};
/**
 * Parameters of {@link TgBot.setMyDefaultAdministratorRights} method.
 * @see https://core.telegram.org/bots/api#setmydefaultadministratorrights
 */
export type TgSetMyDefaultAdministratorRightsParams = {
    /**
     * A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.
     *  */
    rights?: TgChatAdministratorRights;
    /**
     * Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.
     *  */
    for_channels?: boolean;
};
/**
 * Parameters of {@link TgBot.getMyDefaultAdministratorRights} method.
 * @see https://core.telegram.org/bots/api#getmydefaultadministratorrights
 */
export type TgGetMyDefaultAdministratorRightsParams = {
    /**
     * Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.
     *  */
    for_channels?: boolean;
};
/**
 * Parameters of {@link TgBot.editMessageText} method.
 * @see https://core.telegram.org/bots/api#editmessagetext
 */
export type TgEditMessageTextParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * New text of the message, 1-4096 characters after entities parsing
     *  */
    text: string;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     *  */
    entities?: TgMessageEntity[];
    /**
     * Disables link previews for links in this message
     *  */
    disable_web_page_preview?: boolean;
    /**
     * A JSON-serialized object for an inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.editMessageCaption} method.
 * @see https://core.telegram.org/bots/api#editmessagecaption
 */
export type TgEditMessageCaptionParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * New caption of the message, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Mode for parsing entities in the message caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * A JSON-serialized object for an inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.editMessageMedia} method.
 * @see https://core.telegram.org/bots/api#editmessagemedia
 */
export type TgEditMessageMediaParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for a new media content of the message
     *  */
    media: TgInputMedia;
    /**
     * A JSON-serialized object for a new inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.editMessageReplyMarkup} method.
 * @see https://core.telegram.org/bots/api#editmessagereplymarkup
 */
export type TgEditMessageReplyMarkupParams = {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for an inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.stopPoll} method.
 * @see https://core.telegram.org/bots/api#stoppoll
 */
export type TgStopPollParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Identifier of the original message with the poll
     *  */
    message_id: number;
    /**
     * A JSON-serialized object for a new message inline keyboard.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.deleteMessage} method.
 * @see https://core.telegram.org/bots/api#deletemessage
 */
export type TgDeleteMessageParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Identifier of the message to delete
     *  */
    message_id: number;
};
/**
 * Parameters of {@link TgBot.sendSticker} method.
 * @see https://core.telegram.org/bots/api#sendsticker
 */
export type TgSendStickerParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    sticker: TgInputFile | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     *  */
    reply_markup?: TgInlineKeyboardMarkup | TgReplyKeyboardMarkup | TgReplyKeyboardRemove | TgForceReply;
};
/**
 * Parameters of {@link TgBot.getStickerSet} method.
 * @see https://core.telegram.org/bots/api#getstickerset
 */
export type TgGetStickerSetParams = {
    /**
     * Name of the sticker set
     *  */
    name: string;
};
/**
 * Parameters of {@link TgBot.getCustomEmojiStickers} method.
 * @see https://core.telegram.org/bots/api#getcustomemojistickers
 */
export type TgGetCustomEmojiStickersParams = {
    /**
     * List of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
     *  */
    custom_emoji_ids: string[];
};
/**
 * Parameters of {@link TgBot.uploadStickerFile} method.
 * @see https://core.telegram.org/bots/api#uploadstickerfile
 */
export type TgUploadStickerFileParams = {
    /**
     * User identifier of sticker file owner
     *  */
    user_id: number;
    /**
     * PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    png_sticker: TgInputFile;
};
/**
 * Parameters of {@link TgBot.createNewStickerSet} method.
 * @see https://core.telegram.org/bots/api#createnewstickerset
 */
export type TgCreateNewStickerSetParams = {
    /**
     * User identifier of created sticker set owner
     *  */
    user_id: number;
    /**
     * Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters.
     *  */
    name: string;
    /**
     * Sticker set title, 1-64 characters
     *  */
    title: string;
    /**
     * PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    png_sticker?: TgInputFile | string;
    /**
     * TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/stickers#animated-sticker-requirements for technical requirements
     *  */
    tgs_sticker?: TgInputFile;
    /**
     * WEBM video with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/stickers#video-sticker-requirements for technical requirements
     *  */
    webm_sticker?: TgInputFile;
    /**
     * Type of stickers in the set, pass "regular" or "mask". Custom emoji sticker sets can't be created via the Bot API at the moment. By default, a regular sticker set is created.
     *  */
    sticker_type?: string;
    /**
     * One or more emoji corresponding to the sticker
     *  */
    emojis: string;
    /**
     * A JSON-serialized object for position where the mask should be placed on faces
     *  */
    mask_position?: TgMaskPosition;
};
/**
 * Parameters of {@link TgBot.addStickerToSet} method.
 * @see https://core.telegram.org/bots/api#addstickertoset
 */
export type TgAddStickerToSetParams = {
    /**
     * User identifier of sticker set owner
     *  */
    user_id: number;
    /**
     * Sticker set name
     *  */
    name: string;
    /**
     * PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    png_sticker?: TgInputFile | string;
    /**
     * TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/stickers#animated-sticker-requirements for technical requirements
     *  */
    tgs_sticker?: TgInputFile;
    /**
     * WEBM video with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/stickers#video-sticker-requirements for technical requirements
     *  */
    webm_sticker?: TgInputFile;
    /**
     * One or more emoji corresponding to the sticker
     *  */
    emojis: string;
    /**
     * A JSON-serialized object for position where the mask should be placed on faces
     *  */
    mask_position?: TgMaskPosition;
};
/**
 * Parameters of {@link TgBot.setStickerPositionInSet} method.
 * @see https://core.telegram.org/bots/api#setstickerpositioninset
 */
export type TgSetStickerPositionInSetParams = {
    /**
     * File identifier of the sticker
     *  */
    sticker: string;
    /**
     * New sticker position in the set, zero-based
     *  */
    position: number;
};
/**
 * Parameters of {@link TgBot.deleteStickerFromSet} method.
 * @see https://core.telegram.org/bots/api#deletestickerfromset
 */
export type TgDeleteStickerFromSetParams = {
    /**
     * File identifier of the sticker
     *  */
    sticker: string;
};
/**
 * Parameters of {@link TgBot.setStickerSetThumb} method.
 * @see https://core.telegram.org/bots/api#setstickersetthumb
 */
export type TgSetStickerSetThumbParams = {
    /**
     * Sticker set name
     *  */
    name: string;
    /**
     * User identifier of the sticker set owner
     *  */
    user_id: number;
    /**
     * A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#animated-sticker-requirements for animated sticker technical requirements, or a WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-sticker-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Animated sticker set thumbnails can't be uploaded via HTTP URL.
     *  */
    thumb?: TgInputFile | string;
};
/**
 * Parameters of {@link TgBot.answerInlineQuery} method.
 * @see https://core.telegram.org/bots/api#answerinlinequery
 */
export type TgAnswerInlineQueryParams = {
    /**
     * Unique identifier for the answered query
     *  */
    inline_query_id: string;
    /**
     * A JSON-serialized array of results for the inline query
     *  */
    results: TgInlineQueryResult[];
    /**
     * The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
     *  */
    cache_time?: number;
    /**
     * Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
     *  */
    is_personal?: boolean;
    /**
     * Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes.
     *  */
    next_offset?: string;
    /**
     * If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
     *  */
    switch_pm_text?: string;
    /**
     * Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed. Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
     *  */
    switch_pm_parameter?: string;
};
/**
 * Parameters of {@link TgBot.answerWebAppQuery} method.
 * @see https://core.telegram.org/bots/api#answerwebappquery
 */
export type TgAnswerWebAppQueryParams = {
    /**
     * Unique identifier for the query to be answered
     *  */
    web_app_query_id: string;
    /**
     * A JSON-serialized object describing the message to be sent
     *  */
    result: TgInlineQueryResult;
};
/**
 * Parameters of {@link TgBot.sendInvoice} method.
 * @see https://core.telegram.org/bots/api#sendinvoice
 */
export type TgSendInvoiceParams = {
    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     *  */
    chat_id: number | string;
    /**
     * Product name, 1-32 characters
     *  */
    title: string;
    /**
     * Product description, 1-255 characters
     *  */
    description: string;
    /**
     * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     *  */
    payload: string;
    /**
     * Payment provider token, obtained via @BotFather
     *  */
    provider_token: string;
    /**
     * Three-letter ISO 4217 currency code, see more on currencies
     *  */
    currency: string;
    /**
     * Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     *  */
    prices: TgLabeledPrice[];
    /**
     * The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0
     *  */
    max_tip_amount?: number;
    /**
     * A JSON-serialized array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     *  */
    suggested_tip_amounts?: number[];
    /**
     * Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter
     *  */
    start_parameter?: string;
    /**
     * JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     *  */
    provider_data?: string;
    /**
     * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.
     *  */
    photo_url?: string;
    /**
     * Photo size in bytes
     *  */
    photo_size?: number;
    /**
     * Photo width
     *  */
    photo_width?: number;
    /**
     * Photo height
     *  */
    photo_height?: number;
    /**
     * Pass True if you require the user's full name to complete the order
     *  */
    need_name?: boolean;
    /**
     * Pass True if you require the user's phone number to complete the order
     *  */
    need_phone_number?: boolean;
    /**
     * Pass True if you require the user's email address to complete the order
     *  */
    need_email?: boolean;
    /**
     * Pass True if you require the user's shipping address to complete the order
     *  */
    need_shipping_address?: boolean;
    /**
     * Pass True if the user's phone number should be sent to provider
     *  */
    send_phone_number_to_provider?: boolean;
    /**
     * Pass True if the user's email address should be sent to provider
     *  */
    send_email_to_provider?: boolean;
    /**
     * Pass True if the final price depends on the shipping method
     *  */
    is_flexible?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.createInvoiceLink} method.
 * @see https://core.telegram.org/bots/api#createinvoicelink
 */
export type TgCreateInvoiceLinkParams = {
    /**
     * Product name, 1-32 characters
     *  */
    title: string;
    /**
     * Product description, 1-255 characters
     *  */
    description: string;
    /**
     * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     *  */
    payload: string;
    /**
     * Payment provider token, obtained via BotFather
     *  */
    provider_token: string;
    /**
     * Three-letter ISO 4217 currency code, see more on currencies
     *  */
    currency: string;
    /**
     * Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     *  */
    prices: TgLabeledPrice[];
    /**
     * The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0
     *  */
    max_tip_amount?: number;
    /**
     * A JSON-serialized array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     *  */
    suggested_tip_amounts?: number[];
    /**
     * JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     *  */
    provider_data?: string;
    /**
     * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.
     *  */
    photo_url?: string;
    /**
     * Photo size in bytes
     *  */
    photo_size?: number;
    /**
     * Photo width
     *  */
    photo_width?: number;
    /**
     * Photo height
     *  */
    photo_height?: number;
    /**
     * Pass True if you require the user's full name to complete the order
     *  */
    need_name?: boolean;
    /**
     * Pass True if you require the user's phone number to complete the order
     *  */
    need_phone_number?: boolean;
    /**
     * Pass True if you require the user's email address to complete the order
     *  */
    need_email?: boolean;
    /**
     * Pass True if you require the user's shipping address to complete the order
     *  */
    need_shipping_address?: boolean;
    /**
     * Pass True if the user's phone number should be sent to the provider
     *  */
    send_phone_number_to_provider?: boolean;
    /**
     * Pass True if the user's email address should be sent to the provider
     *  */
    send_email_to_provider?: boolean;
    /**
     * Pass True if the final price depends on the shipping method
     *  */
    is_flexible?: boolean;
};
/**
 * Parameters of {@link TgBot.answerShippingQuery} method.
 * @see https://core.telegram.org/bots/api#answershippingquery
 */
export type TgAnswerShippingQueryParams = {
    /**
     * Unique identifier for the query to be answered
     *  */
    shipping_query_id: string;
    /**
     * Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     *  */
    ok: boolean;
    /**
     * Required if ok is True. A JSON-serialized array of available shipping options.
     *  */
    shipping_options?: TgShippingOption[];
    /**
     * Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user.
     *  */
    error_message?: string;
};
/**
 * Parameters of {@link TgBot.answerPreCheckoutQuery} method.
 * @see https://core.telegram.org/bots/api#answerprecheckoutquery
 */
export type TgAnswerPreCheckoutQueryParams = {
    /**
     * Unique identifier for the query to be answered
     *  */
    pre_checkout_query_id: string;
    /**
     * Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     *  */
    ok: boolean;
    /**
     * Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
     *  */
    error_message?: string;
};
/**
 * Parameters of {@link TgBot.setPassportDataErrors} method.
 * @see https://core.telegram.org/bots/api#setpassportdataerrors
 */
export type TgSetPassportDataErrorsParams = {
    /**
     * User identifier
     *  */
    user_id: number;
    /**
     * A JSON-serialized array describing the errors
     *  */
    errors: TgPassportElementError[];
};
/**
 * Parameters of {@link TgBot.sendGame} method.
 * @see https://core.telegram.org/bots/api#sendgame
 */
export type TgSendGameParams = {
    /**
     * Unique identifier for the target chat
     *  */
    chat_id: number;
    /**
     * Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather.
     *  */
    game_short_name: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *  */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     *  */
    protect_content?: boolean;
    /**
     * If the message is a reply, ID of the original message
     *  */
    reply_to_message_id?: number;
    /**
     * Pass True if the message should be sent even if the specified replied-to message is not found
     *  */
    allow_sending_without_reply?: boolean;
    /**
     * A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Parameters of {@link TgBot.setGameScore} method.
 * @see https://core.telegram.org/bots/api#setgamescore
 */
export type TgSetGameScoreParams = {
    /**
     * User identifier
     *  */
    user_id: number;
    /**
     * New score, must be non-negative
     *  */
    score: number;
    /**
     * Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters
     *  */
    force?: boolean;
    /**
     * Pass True if the game message should not be automatically edited to include the current scoreboard
     *  */
    disable_edit_message?: boolean;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat
     *  */
    chat_id?: number;
    /**
     * Required if inline_message_id is not specified. Identifier of the sent message
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
};
/**
 * Parameters of {@link TgBot.getGameHighScores} method.
 * @see https://core.telegram.org/bots/api#getgamehighscores
 */
export type TgGetGameHighScoresParams = {
    /**
     * Target user id
     *  */
    user_id: number;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat
     *  */
    chat_id?: number;
    /**
     * Required if inline_message_id is not specified. Identifier of the sent message
     *  */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message
     *  */
    inline_message_id?: string;
};
/**
 * This object represents an incoming update.
 * At most one of the optional parameters can be present in any given update.
 * @see https://core.telegram.org/bots/api#update
 */
export type TgUpdate = {
    /**
     * The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This ID becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.
     *  */
    update_id: number;
    /**
     * Optional. New incoming message of any kind - text, photo, sticker, etc.
     *  */
    message?: TgMessage;
    /**
     * Optional. New version of a message that is known to the bot and was edited
     *  */
    edited_message?: TgMessage;
    /**
     * Optional. New incoming channel post of any kind - text, photo, sticker, etc.
     *  */
    channel_post?: TgMessage;
    /**
     * Optional. New version of a channel post that is known to the bot and was edited
     *  */
    edited_channel_post?: TgMessage;
    /**
     * Optional. New incoming inline query
     *  */
    inline_query?: TgInlineQuery;
    /**
     * Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.
     *  */
    chosen_inline_result?: TgChosenInlineResult;
    /**
     * Optional. New incoming callback query
     *  */
    callback_query?: TgCallbackQuery;
    /**
     * Optional. New incoming shipping query. Only for invoices with flexible price
     *  */
    shipping_query?: TgShippingQuery;
    /**
     * Optional. New incoming pre-checkout query. Contains full information about checkout
     *  */
    pre_checkout_query?: TgPreCheckoutQuery;
    /**
     * Optional. New poll state. Bots receive only updates about stopped polls and polls, which are sent by the bot
     *  */
    poll?: TgPoll;
    /**
     * Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.
     *  */
    poll_answer?: TgPollAnswer;
    /**
     * Optional. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.
     *  */
    my_chat_member?: TgChatMemberUpdated;
    /**
     * Optional. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify "chat_member" in the list of allowed_updates to receive these updates.
     *  */
    chat_member?: TgChatMemberUpdated;
    /**
     * Optional. A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates.
     *  */
    chat_join_request?: TgChatJoinRequest;
};
/**
 * Describes the current status of a webhook.
 * @see https://core.telegram.org/bots/api#webhookinfo
 */
export type TgWebhookInfo = {
    /**
     * Webhook URL, may be empty if webhook is not set up
     *  */
    url: string;
    /**
     * True, if a custom certificate was provided for webhook certificate checks
     *  */
    has_custom_certificate: boolean;
    /**
     * Number of updates awaiting delivery
     *  */
    pending_update_count: number;
    /**
     * Optional. Currently used webhook IP address
     *  */
    ip_address?: string;
    /**
     * Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook
     *  */
    last_error_date?: number;
    /**
     * Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
     *  */
    last_error_message?: string;
    /**
     * Optional. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters
     *  */
    last_synchronization_error_date?: number;
    /**
     * Optional. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
     *  */
    max_connections?: number;
    /**
     * Optional. A list of update types the bot is subscribed to. Defaults to all update types except chat_member
     *  */
    allowed_updates?: string[];
};
/**
 * This object represents a Telegram user or bot.
 * @see https://core.telegram.org/bots/api#user
 */
export type TgUser = {
    /**
     * Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    id: number;
    /**
     * True, if this user is a bot
     *  */
    is_bot: boolean;
    /**
     * User's or bot's first name
     *  */
    first_name: string;
    /**
     * Optional. User's or bot's last name
     *  */
    last_name?: string;
    /**
     * Optional. User's or bot's username
     *  */
    username?: string;
    /**
     * Optional. IETF language tag of the user's language
     *  */
    language_code?: string;
    /**
     * Optional. True, if this user is a Telegram Premium user
     *  */
    is_premium?: boolean;
    /**
     * Optional. True, if this user added the bot to the attachment menu
     *  */
    added_to_attachment_menu?: boolean;
    /**
     * Optional. True, if the bot can be invited to groups. Returned only in getMe.
     *  */
    can_join_groups?: boolean;
    /**
     * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
     *  */
    can_read_all_group_messages?: boolean;
    /**
     * Optional. True, if the bot supports inline queries. Returned only in getMe.
     *  */
    supports_inline_queries?: boolean;
};
/**
 * This object represents a chat.
 * @see https://core.telegram.org/bots/api#chat
 */
export type TgChat = {
    /**
     * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    id: number;
    /**
     * Type of chat, can be either "private", "group", "supergroup" or "channel"
     *  */
    type: "private" | "group" | "supergroup" | "channel";
    /**
     * Optional. Title, for supergroups, channels and group chats
     *  */
    title?: string;
    /**
     * Optional. Username, for private chats, supergroups and channels if available
     *  */
    username?: string;
    /**
     * Optional. First name of the other party in a private chat
     *  */
    first_name?: string;
    /**
     * Optional. Last name of the other party in a private chat
     *  */
    last_name?: string;
    /**
     * Optional. Chat photo. Returned only in getChat.
     *  */
    photo?: TgChatPhoto;
    /**
     * Optional. Bio of the other party in a private chat. Returned only in getChat.
     *  */
    bio?: string;
    /**
     * Optional. True, if privacy settings of the other party in the private chat allows to use tg://user?id=<user_id> links only in chats with the user. Returned only in getChat.
     *  */
    has_private_forwards?: boolean;
    /**
     * Optional. True, if the privacy settings of the other party restrict sending voice and video note messages in the private chat. Returned only in getChat.
     *  */
    has_restricted_voice_and_video_messages?: boolean;
    /**
     * Optional. True, if users need to join the supergroup before they can send messages. Returned only in getChat.
     *  */
    join_to_send_messages?: boolean;
    /**
     * Optional. True, if all users directly joining the supergroup need to be approved by supergroup administrators. Returned only in getChat.
     *  */
    join_by_request?: boolean;
    /**
     * Optional. Description, for groups, supergroups and channel chats. Returned only in getChat.
     *  */
    description?: string;
    /**
     * Optional. Primary invite link, for groups, supergroups and channel chats. Returned only in getChat.
     *  */
    invite_link?: string;
    /**
     * Optional. The most recent pinned message (by sending date). Returned only in getChat.
     *  */
    pinned_message?: TgMessage;
    /**
     * Optional. Default chat member permissions, for groups and supergroups. Returned only in getChat.
     *  */
    permissions?: TgChatPermissions;
    /**
     * Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unpriviledged user; in seconds. Returned only in getChat.
     *  */
    slow_mode_delay?: number;
    /**
     * Optional. The time after which all messages sent to the chat will be automatically deleted; in seconds. Returned only in getChat.
     *  */
    message_auto_delete_time?: number;
    /**
     * Optional. True, if messages from the chat can't be forwarded to other chats. Returned only in getChat.
     *  */
    has_protected_content?: boolean;
    /**
     * Optional. For supergroups, name of group sticker set. Returned only in getChat.
     *  */
    sticker_set_name?: string;
    /**
     * Optional. True, if the bot can change the group sticker set. Returned only in getChat.
     *  */
    can_set_sticker_set?: boolean;
    /**
     * Optional. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier. Returned only in getChat.
     *  */
    linked_chat_id?: number;
    /**
     * Optional. For supergroups, the location to which the supergroup is connected. Returned only in getChat.
     *  */
    location?: TgChatLocation;
};
/**
 * This object represents a message.
 * @see https://core.telegram.org/bots/api#message
 */
export type TgMessage = {
    /**
     * Unique message identifier inside this chat
     *  */
    message_id: number;
    /**
     * Optional. Sender of the message; empty for messages sent to channels. For backward compatibility, the field contains a fake sender user in non-channel chats, if the message was sent on behalf of a chat.
     *  */
    from?: TgUser;
    /**
     * Optional. Sender of the message, sent on behalf of a chat. For example, the channel itself for channel posts, the supergroup itself for messages from anonymous group administrators, the linked channel for messages automatically forwarded to the discussion group. For backward compatibility, the field from contains a fake sender user in non-channel chats, if the message was sent on behalf of a chat.
     *  */
    sender_chat?: TgChat;
    /**
     * Date the message was sent in Unix time
     *  */
    date: number;
    /**
     * Conversation the message belongs to
     *  */
    chat: TgChat;
    /**
     * Optional. For forwarded messages, sender of the original message
     *  */
    forward_from?: TgUser;
    /**
     * Optional. For messages forwarded from channels or from anonymous administrators, information about the original sender chat
     *  */
    forward_from_chat?: TgChat;
    /**
     * Optional. For messages forwarded from channels, identifier of the original message in the channel
     *  */
    forward_from_message_id?: number;
    /**
     * Optional. For forwarded messages that were originally sent in channels or by an anonymous chat administrator, signature of the message sender if present
     *  */
    forward_signature?: string;
    /**
     * Optional. Sender's name for messages forwarded from users who disallow adding a link to their account in forwarded messages
     *  */
    forward_sender_name?: string;
    /**
     * Optional. For forwarded messages, date the original message was sent in Unix time
     *  */
    forward_date?: number;
    /**
     * Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group
     *  */
    is_automatic_forward?: boolean;
    /**
     * Optional. For replies, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
     *  */
    reply_to_message?: TgMessage;
    /**
     * Optional. Bot through which the message was sent
     *  */
    via_bot?: TgUser;
    /**
     * Optional. Date the message was last edited in Unix time
     *  */
    edit_date?: number;
    /**
     * Optional. True, if the message can't be forwarded
     *  */
    has_protected_content?: boolean;
    /**
     * Optional. The unique identifier of a media message group this message belongs to
     *  */
    media_group_id?: string;
    /**
     * Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator
     *  */
    author_signature?: string;
    /**
     * Optional. For text messages, the actual UTF-8 text of the message
     *  */
    text?: string;
    /**
     * Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
     *  */
    entities?: TgMessageEntity[];
    /**
     * Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set
     *  */
    animation?: TgAnimation;
    /**
     * Optional. Message is an audio file, information about the file
     *  */
    audio?: TgAudio;
    /**
     * Optional. Message is a general file, information about the file
     *  */
    document?: TgDocument;
    /**
     * Optional. Message is a photo, available sizes of the photo
     *  */
    photo?: TgPhotoSize[];
    /**
     * Optional. Message is a sticker, information about the sticker
     *  */
    sticker?: TgSticker;
    /**
     * Optional. Message is a video, information about the video
     *  */
    video?: TgVideo;
    /**
     * Optional. Message is a video note, information about the video message
     *  */
    video_note?: TgVideoNote;
    /**
     * Optional. Message is a voice message, information about the file
     *  */
    voice?: TgVoice;
    /**
     * Optional. Caption for the animation, audio, document, photo, video or voice
     *  */
    caption?: string;
    /**
     * Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Message is a shared contact, information about the contact
     *  */
    contact?: TgContact;
    /**
     * Optional. Message is a dice with random value
     *  */
    dice?: TgDice;
    /**
     * Optional. Message is a game, information about the game. More about games: https://core.telegram.org/bots/api#games
     *  */
    game?: TgGame;
    /**
     * Optional. Message is a native poll, information about the poll
     *  */
    poll?: TgPoll;
    /**
     * Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set
     *  */
    venue?: TgVenue;
    /**
     * Optional. Message is a shared location, information about the location
     *  */
    location?: TgLocation;
    /**
     * Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
     *  */
    new_chat_members?: TgUser[];
    /**
     * Optional. A member was removed from the group, information about them (this member may be the bot itself)
     *  */
    left_chat_member?: TgUser;
    /**
     * Optional. A chat title was changed to this value
     *  */
    new_chat_title?: string;
    /**
     * Optional. A chat photo was change to this value
     *  */
    new_chat_photo?: TgPhotoSize[];
    /**
     * Optional. Service message: the chat photo was deleted
     *  */
    delete_chat_photo?: boolean;
    /**
     * Optional. Service message: the group has been created
     *  */
    group_chat_created?: boolean;
    /**
     * Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
     *  */
    supergroup_chat_created?: boolean;
    /**
     * Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
     *  */
    channel_chat_created?: boolean;
    /**
     * Optional. Service message: auto-delete timer settings changed in the chat
     *  */
    message_auto_delete_timer_changed?: TgMessageAutoDeleteTimerChanged;
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    migrate_to_chat_id?: number;
    /**
     * Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    migrate_from_chat_id?: number;
    /**
     * Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply.
     *  */
    pinned_message?: TgMessage;
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments: https://core.telegram.org/bots/api#payments
     *  */
    invoice?: TgInvoice;
    /**
     * Optional. Message is a service message about a successful payment, information about the payment. More about payments: https://core.telegram.org/bots/api#payments
     *  */
    successful_payment?: TgSuccessfulPayment;
    /**
     * Optional. The domain name of the website on which the user has logged in. More about Telegram Login: https://core.telegram.org/widgets/login
     *  */
    connected_website?: string;
    /**
     * Optional. Telegram Passport data
     *  */
    passport_data?: TgPassportData;
    /**
     * Optional. Service message. A user in the chat triggered another user's proximity alert while sharing Live Location.
     *  */
    proximity_alert_triggered?: TgProximityAlertTriggered;
    /**
     * Optional. Service message: video chat scheduled
     *  */
    video_chat_scheduled?: TgVideoChatScheduled;
    /**
     * Optional. Service message: video chat started
     *  */
    video_chat_started?: TgVideoChatStarted;
    /**
     * Optional. Service message: video chat ended
     *  */
    video_chat_ended?: TgVideoChatEnded;
    /**
     * Optional. Service message: new participants invited to a video chat
     *  */
    video_chat_participants_invited?: TgVideoChatParticipantsInvited;
    /**
     * Optional. Service message: data sent by a Web App
     *  */
    web_app_data?: TgWebAppData;
    /**
     * Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * This object represents a unique message identifier.
 * @see https://core.telegram.org/bots/api#messageid
 */
export type TgMessageId = {
    /**
     * Unique message identifier
     *  */
    message_id: number;
};
/**
 * This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.
 * @see https://core.telegram.org/bots/api#messageentity
 */
export type TgMessageEntity = {
    /**
     * Type of the entity. Currently, can be "mention" (@username), "hashtag" (#hashtag), "cashtag" ($USD), "bot_command" (/start@jobs_bot), "url" (https://telegram.org), "email" (do-not-reply@telegram.org), "phone_number" (+1-212-555-0123), "bold" (bold text), "italic" (italic text), "underline" (underlined text), "strikethrough" (strikethrough text), "spoiler" (spoiler message), "code" (monowidth string), "pre" (monowidth block), "text_link" (for clickable text URLs), "text_mention" (for users without usernames), "custom_emoji" (for inline custom emoji stickers)
     *  */
    type: "mention" | "hashtag" | "cashtag" | "bot_command" | "url" | "email" | "phone_number" | "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "code" | "pre" | "text_link" | "text_mention" | "custom_emoji";
    /**
     * Offset in UTF-16 code units to the start of the entity
     *  */
    offset: number;
    /**
     * Length of the entity in UTF-16 code units
     *  */
    length: number;
    /**
     * Optional. For "text_link" only, URL that will be opened after user taps on the text
     *  */
    url?: string;
    /**
     * Optional. For "text_mention" only, the mentioned user
     *  */
    user?: TgUser;
    /**
     * Optional. For "pre" only, the programming language of the entity text
     *  */
    language?: string;
    /**
     * Optional. For "custom_emoji" only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker
     *  */
    custom_emoji_id?: string;
};
/**
 * This object represents one size of a photo or a file / sticker thumbnail.
 * @see https://core.telegram.org/bots/api#photosize
 */
export type TgPhotoSize = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Photo width
     *  */
    width: number;
    /**
     * Photo height
     *  */
    height: number;
    /**
     * Optional. File size in bytes
     *  */
    file_size?: number;
};
/**
 * This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).
 * @see https://core.telegram.org/bots/api#animation
 */
export type TgAnimation = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Video width as defined by sender
     *  */
    width: number;
    /**
     * Video height as defined by sender
     *  */
    height: number;
    /**
     * Duration of the video in seconds as defined by sender
     *  */
    duration: number;
    /**
     * Optional. Animation thumbnail as defined by sender
     *  */
    thumb?: TgPhotoSize;
    /**
     * Optional. Original animation filename as defined by sender
     *  */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by sender
     *  */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
};
/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 * @see https://core.telegram.org/bots/api#audio
 */
export type TgAudio = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Duration of the audio in seconds as defined by sender
     *  */
    duration: number;
    /**
     * Optional. Performer of the audio as defined by sender or by audio tags
     *  */
    performer?: string;
    /**
     * Optional. Title of the audio as defined by sender or by audio tags
     *  */
    title?: string;
    /**
     * Optional. Original filename as defined by sender
     *  */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by sender
     *  */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
    /**
     * Optional. Thumbnail of the album cover to which the music file belongs
     *  */
    thumb?: TgPhotoSize;
};
/**
 * This object represents a general file (as opposed to photos, voice messages and audio files).
 * @see https://core.telegram.org/bots/api#document
 */
export type TgDocument = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Optional. Document thumbnail as defined by sender
     *  */
    thumb?: TgPhotoSize;
    /**
     * Optional. Original filename as defined by sender
     *  */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by sender
     *  */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
};
/**
 * This object represents a video file.
 * @see https://core.telegram.org/bots/api#video
 */
export type TgVideo = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Video width as defined by sender
     *  */
    width: number;
    /**
     * Video height as defined by sender
     *  */
    height: number;
    /**
     * Duration of the video in seconds as defined by sender
     *  */
    duration: number;
    /**
     * Optional. Video thumbnail
     *  */
    thumb?: TgPhotoSize;
    /**
     * Optional. Original filename as defined by sender
     *  */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by sender
     *  */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
};
/**
 * This object represents a video message (available in Telegram apps as of v.4.0).
 * @see https://core.telegram.org/bots/api#videonote
 */
export type TgVideoNote = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Video width and height (diameter of the video message) as defined by sender
     *  */
    length: number;
    /**
     * Duration of the video in seconds as defined by sender
     *  */
    duration: number;
    /**
     * Optional. Video thumbnail
     *  */
    thumb?: TgPhotoSize;
    /**
     * Optional. File size in bytes
     *  */
    file_size?: number;
};
/**
 * This object represents a voice note.
 * @see https://core.telegram.org/bots/api#voice
 */
export type TgVoice = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Duration of the audio in seconds as defined by sender
     *  */
    duration: number;
    /**
     * Optional. MIME type of the file as defined by sender
     *  */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
};
/**
 * This object represents a phone contact.
 * @see https://core.telegram.org/bots/api#contact
 */
export type TgContact = {
    /**
     * Contact's phone number
     *  */
    phone_number: string;
    /**
     * Contact's first name
     *  */
    first_name: string;
    /**
     * Optional. Contact's last name
     *  */
    last_name?: string;
    /**
     * Optional. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    user_id?: number;
    /**
     * Optional. Additional data about the contact in the form of a vCard
     *  */
    vcard?: string;
};
/**
 * This object represents an animated emoji that displays a random value.
 * @see https://core.telegram.org/bots/api#dice
 */
export type TgDice = {
    /**
     * Emoji on which the dice throw animation is based
     *  */
    emoji: string;
    /**
     * Value of the dice, 1-6 for "????", "????" and "????" base emoji, 1-5 for "????" and "???" base emoji, 1-64 for "????" base emoji
     *  */
    value: number;
};
/**
 * This object contains information about one answer option in a poll.
 * @see https://core.telegram.org/bots/api#polloption
 */
export type TgPollOption = {
    /**
     * Option text, 1-100 characters
     *  */
    text: string;
    /**
     * Number of users that voted for this option
     *  */
    voter_count: number;
};
/**
 * This object represents an answer of a user in a non-anonymous poll.
 * @see https://core.telegram.org/bots/api#pollanswer
 */
export type TgPollAnswer = {
    /**
     * Unique poll identifier
     *  */
    poll_id: string;
    /**
     * The user, who changed the answer to the poll
     *  */
    user: TgUser;
    /**
     * 0-based identifiers of answer options, chosen by the user. May be empty if the user retracted their vote.
     *  */
    option_ids: number[];
};
/**
 * This object contains information about a poll.
 * @see https://core.telegram.org/bots/api#poll
 */
export type TgPoll = {
    /**
     * Unique poll identifier
     *  */
    id: string;
    /**
     * Poll question, 1-300 characters
     *  */
    question: string;
    /**
     * List of poll options
     *  */
    options: TgPollOption[];
    /**
     * Total number of users that voted in the poll
     *  */
    total_voter_count: number;
    /**
     * True, if the poll is closed
     *  */
    is_closed: boolean;
    /**
     * True, if the poll is anonymous
     *  */
    is_anonymous: boolean;
    /**
     * Poll type, currently can be "regular" or "quiz"
     *  */
    type: "regular" | "quiz";
    /**
     * True, if the poll allows multiple answers
     *  */
    allows_multiple_answers: boolean;
    /**
     * Optional. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot.
     *  */
    correct_option_id?: number;
    /**
     * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
     *  */
    explanation?: string;
    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
     *  */
    explanation_entities?: TgMessageEntity[];
    /**
     * Optional. Amount of time in seconds the poll will be active after creation
     *  */
    open_period?: number;
    /**
     * Optional. Point in time (Unix timestamp) when the poll will be automatically closed
     *  */
    close_date?: number;
};
/**
 * This object represents a point on the map.
 * @see https://core.telegram.org/bots/api#location
 */
export type TgLocation = {
    /**
     * Longitude as defined by sender
     *  */
    longitude: number;
    /**
     * Latitude as defined by sender
     *  */
    latitude: number;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     *  */
    horizontal_accuracy?: number;
    /**
     * Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
     *  */
    live_period?: number;
    /**
     * Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.
     *  */
    heading?: number;
    /**
     * Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
     *  */
    proximity_alert_radius?: number;
};
/**
 * This object represents a venue.
 * @see https://core.telegram.org/bots/api#venue
 */
export type TgVenue = {
    /**
     * Venue location. Can't be a live location
     *  */
    location: TgLocation;
    /**
     * Name of the venue
     *  */
    title: string;
    /**
     * Address of the venue
     *  */
    address: string;
    /**
     * Optional. Foursquare identifier of the venue
     *  */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
     *  */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     *  */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     *  */
    google_place_type?: string;
};
/**
 * Describes data sent from a Web App to the bot.
 * @see https://core.telegram.org/bots/api#webappdata
 */
export type TgWebAppData = {
    /**
     * The data. Be aware that a bad client can send arbitrary data in this field.
     *  */
    data: string;
    /**
     * Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.
     *  */
    button_text: string;
};
/**
 * This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.
 * @see https://core.telegram.org/bots/api#proximityalerttriggered
 */
export type TgProximityAlertTriggered = {
    /**
     * User that triggered the alert
     *  */
    traveler: TgUser;
    /**
     * User that set the alert
     *  */
    watcher: TgUser;
    /**
     * The distance between the users
     *  */
    distance: number;
};
/**
 * This object represents a service message about a change in auto-delete timer settings.
 * @see https://core.telegram.org/bots/api#messageautodeletetimerchanged
 */
export type TgMessageAutoDeleteTimerChanged = {
    /**
     * New auto-delete time for messages in the chat; in seconds
     *  */
    message_auto_delete_time: number;
};
/**
 * This object represents a service message about a video chat scheduled in the chat.
 * @see https://core.telegram.org/bots/api#videochatscheduled
 */
export type TgVideoChatScheduled = {
    /**
     * Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator
     *  */
    start_date: number;
};
/**
 * This object represents a service message about a video chat started in the chat. Currently holds no information.
 * @see https://core.telegram.org/bots/api#videochatstarted
 */
export type TgVideoChatStarted = {};
/**
 * This object represents a service message about a video chat ended in the chat.
 * @see https://core.telegram.org/bots/api#videochatended
 */
export type TgVideoChatEnded = {
    /**
     * Video chat duration in seconds
     *  */
    duration: number;
};
/**
 * This object represents a service message about new members invited to a video chat.
 * @see https://core.telegram.org/bots/api#videochatparticipantsinvited
 */
export type TgVideoChatParticipantsInvited = {
    /**
     * New members that were invited to the video chat
     *  */
    users: TgUser[];
};
/**
 * This object represent a user's profile pictures.
 * @see https://core.telegram.org/bots/api#userprofilephotos
 */
export type TgUserProfilePhotos = {
    /**
     * Total number of profile pictures the target user has
     *  */
    total_count: number;
    /**
     * Requested profile pictures (in up to 4 sizes each)
     *  */
    photos: TgPhotoSize[][];
};
/**
 * This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile.
 * @see https://core.telegram.org/bots/api#file
 */
export type TgFile = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     *  */
    file_size?: number;
    /**
     * Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file.
     *  */
    file_path?: string;
};
/**
 * Describes a Web App.
 * @see https://core.telegram.org/bots/api#webappinfo
 */
export type TgWebAppInfo = {
    /**
     * An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps
     *  */
    url: string;
};
/**
 * This object represents a custom keyboard with reply options (see Introduction to bots for details and examples).
 * @see https://core.telegram.org/bots/api#replykeyboardmarkup
 */
export type TgReplyKeyboardMarkup = {
    /**
     * Array of button rows, each represented by an Array of KeyboardButton objects
     *  */
    keyboard: TgKeyboardButton[][];
    /**
     * Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard.
     *  */
    resize_keyboard?: boolean;
    /**
     * Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to false.
     *  */
    one_time_keyboard?: boolean;
    /**
     * Optional. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters
     *  */
    input_field_placeholder?: string;
    /**
     * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message. Example: A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard.
     *  */
    selective?: boolean;
};
/**
 * This object represents one button of the reply keyboard. For simple text buttons String can be used instead of this object to specify text of the button. Optional fields web_app, request_contact, request_location, and request_poll are mutually exclusive.
 * Note: request_contact and request_location options will only work in Telegram versions released after 9 April, 2016. Older clients will display unsupported message.
 * Note: request_poll option will only work in Telegram versions released after 23 January, 2020. Older clients will display unsupported message.
 * Note: web_app option will only work in Telegram versions released after 16 April, 2022. Older clients will display unsupported message.
 * @see https://core.telegram.org/bots/api#keyboardbutton
 */
export type TgKeyboardButton = {
    /**
     * Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
     *  */
    text: string;
    /**
     * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only.
     *  */
    request_contact?: boolean;
    /**
     * Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only.
     *  */
    request_location?: boolean;
    /**
     * Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.
     *  */
    request_poll?: TgKeyboardButtonPollType;
    /**
     * Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a "web_app_data" service message. Available in private chats only.
     *  */
    web_app?: TgWebAppInfo;
};
/**
 * This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed.
 * @see https://core.telegram.org/bots/api#keyboardbuttonpolltype
 */
export type TgKeyboardButtonPollType = {
    /**
     * Optional. If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type.
     *  */
    type?: string;
};
/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see ReplyKeyboardMarkup).
 * @see https://core.telegram.org/bots/api#replykeyboardremove
 */
export type TgReplyKeyboardRemove = {
    /**
     * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup)
     *  */
    remove_keyboard: boolean;
    /**
     * Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message. Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.
     *  */
    selective?: boolean;
};
/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will display unsupported message.
 * @see https://core.telegram.org/bots/api#inlinekeyboardmarkup
 */
export type TgInlineKeyboardMarkup = {
    /**
     * Array of button rows, each represented by an Array of InlineKeyboardButton objects
     *  */
    inline_keyboard: TgInlineKeyboardButton[][];
};
/**
 * This object represents one button of an inline keyboard. You must use exactly one of the optional fields.
 * @see https://core.telegram.org/bots/api#inlinekeyboardbutton
 */
export type TgInlineKeyboardButton = {
    /**
     * Label text on the button
     *  */
    text: string;
    /**
     * Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their ID without using a username, if this is allowed by their privacy settings.
     *  */
    url?: string;
    /**
     * Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
     *  */
    callback_data?: string;
    /**
     * Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot.
     *  */
    web_app?: TgWebAppInfo;
    /**
     * Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget.
     *  */
    login_url?: TgLoginUrl;
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a private chat with it. Especially useful when combined with switch_pm... actions - in this case the user will be automatically returned to the chat they switched from, skipping the chat selection screen.
     *  */
    switch_inline_query?: string;
    /**
     * Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options.
     *  */
    switch_inline_query_current_chat?: string;
    /**
     * Optional. Description of the game that will be launched when the user presses the button. NOTE: This type of button must always be the first button in the first row.
     *  */
    callback_game?: TgCallbackGame;
    /**
     * Optional. Specify True, to send a Pay button. NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages.
     *  */
    pay?: boolean;
};
/**
 * This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the Telegram Login Widget when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:
 * Telegram apps support these buttons as of version 5.7.
 * @see https://core.telegram.org/bots/api#loginurl
 */
export type TgLoginUrl = {
    /**
     * An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data. NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
     *  */
    url: string;
    /**
     * Optional. New text of the button in forwarded messages.
     *  */
    forward_text?: string;
    /**
     * Optional. Username of a bot, which will be used for user authorization. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details.
     *  */
    bot_username?: string;
    /**
     * Optional. Pass True to request the permission for your bot to send messages to the user.
     *  */
    request_write_access?: boolean;
};
/**
 * This object represents an incoming callback query from a callback button in an inline keyboard. If the button that originated the query was attached to a message sent by the bot, the field message will be present. If the button was attached to a message sent via the bot (in inline mode), the field inline_message_id will be present. Exactly one of the fields data or game_short_name will be present.
 * @see https://core.telegram.org/bots/api#callbackquery
 */
export type TgCallbackQuery = {
    /**
     * Unique identifier for this query
     *  */
    id: string;
    /**
     * Sender
     *  */
    from: TgUser;
    /**
     * Optional. Message with the callback button that originated the query. Note that message content and message date will not be available if the message is too old
     *  */
    message?: TgMessage;
    /**
     * Optional. Identifier of the message sent via the bot in inline mode, that originated the query.
     *  */
    inline_message_id?: string;
    /**
     * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
     *  */
    chat_instance: string;
    /**
     * Optional. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.
     *  */
    data?: string;
    /**
     * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
     *  */
    game_short_name?: string;
};
/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode.
 * @see https://core.telegram.org/bots/api#forcereply
 */
export type TgForceReply = {
    /**
     * Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'
     *  */
    force_reply: boolean;
    /**
     * Optional. The placeholder to be shown in the input field when the reply is active; 1-64 characters
     *  */
    input_field_placeholder?: string;
    /**
     * Optional. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message.
     *  */
    selective?: boolean;
};
/**
 * This object represents a chat photo.
 * @see https://core.telegram.org/bots/api#chatphoto
 */
export type TgChatPhoto = {
    /**
     * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     *  */
    small_file_id: string;
    /**
     * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    small_file_unique_id: string;
    /**
     * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     *  */
    big_file_id: string;
    /**
     * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    big_file_unique_id: string;
};
/**
 * Represents an invite link for a chat.
 * @see https://core.telegram.org/bots/api#chatinvitelink
 */
export type TgChatInviteLink = {
    /**
     * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with "...".
     *  */
    invite_link: string;
    /**
     * Creator of the link
     *  */
    creator: TgUser;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators
     *  */
    creates_join_request: boolean;
    /**
     * True, if the link is primary
     *  */
    is_primary: boolean;
    /**
     * True, if the link is revoked
     *  */
    is_revoked: boolean;
    /**
     * Optional. Invite link name
     *  */
    name?: string;
    /**
     * Optional. Point in time (Unix timestamp) when the link will expire or has been expired
     *  */
    expire_date?: number;
    /**
     * Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     *  */
    member_limit?: number;
    /**
     * Optional. Number of pending join requests created using this link
     *  */
    pending_join_request_count?: number;
};
/**
 * Represents the rights of an administrator in a chat.
 * @see https://core.telegram.org/bots/api#chatadministratorrights
 */
export type TgChatAdministratorRights = {
    /**
     * True, if the user's presence in the chat is hidden
     *  */
    is_anonymous: boolean;
    /**
     * True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege
     *  */
    can_manage_chat: boolean;
    /**
     * True, if the administrator can delete messages of other users
     *  */
    can_delete_messages: boolean;
    /**
     * True, if the administrator can manage video chats
     *  */
    can_manage_video_chats: boolean;
    /**
     * True, if the administrator can restrict, ban or unban chat members
     *  */
    can_restrict_members: boolean;
    /**
     * True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user)
     *  */
    can_promote_members: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     *  */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     *  */
    can_invite_users: boolean;
    /**
     * Optional. True, if the administrator can post in the channel; channels only
     *  */
    can_post_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit messages of other users and can pin messages; channels only
     *  */
    can_edit_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages; groups and supergroups only
     *  */
    can_pin_messages?: boolean;
};
/**
 * This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:
 * - ChatMemberOwner
 * - ChatMemberAdministrator
 * - ChatMemberMember
 * - ChatMemberRestricted
 * - ChatMemberLeft
 * - ChatMemberBanned
 * @see https://core.telegram.org/bots/api#chatmember
 */
export type TgChatMember = TgChatMemberOwner | TgChatMemberAdministrator | TgChatMemberMember | TgChatMemberRestricted | TgChatMemberLeft | TgChatMemberBanned;
/**
 * Represents a chat member that owns the chat and has all administrator privileges.
 * @see https://core.telegram.org/bots/api#chatmemberowner
 */
export type TgChatMemberOwner = {
    /**
     * The member's status in the chat, always "creator"
     *  */
    status: "creator";
    /**
     * Information about the user
     *  */
    user: TgUser;
    /**
     * True, if the user's presence in the chat is hidden
     *  */
    is_anonymous: boolean;
    /**
     * Optional. Custom title for this user
     *  */
    custom_title?: string;
};
/**
 * Represents a chat member that has some additional privileges.
 * @see https://core.telegram.org/bots/api#chatmemberadministrator
 */
export type TgChatMemberAdministrator = {
    /**
     * The member's status in the chat, always "administrator"
     *  */
    status: "administrator";
    /**
     * Information about the user
     *  */
    user: TgUser;
    /**
     * True, if the bot is allowed to edit administrator privileges of that user
     *  */
    can_be_edited: boolean;
    /**
     * True, if the user's presence in the chat is hidden
     *  */
    is_anonymous: boolean;
    /**
     * True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege
     *  */
    can_manage_chat: boolean;
    /**
     * True, if the administrator can delete messages of other users
     *  */
    can_delete_messages: boolean;
    /**
     * True, if the administrator can manage video chats
     *  */
    can_manage_video_chats: boolean;
    /**
     * True, if the administrator can restrict, ban or unban chat members
     *  */
    can_restrict_members: boolean;
    /**
     * True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user)
     *  */
    can_promote_members: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     *  */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     *  */
    can_invite_users: boolean;
    /**
     * Optional. True, if the administrator can post in the channel; channels only
     *  */
    can_post_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit messages of other users and can pin messages; channels only
     *  */
    can_edit_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages; groups and supergroups only
     *  */
    can_pin_messages?: boolean;
    /**
     * Optional. Custom title for this user
     *  */
    custom_title?: string;
};
/**
 * Represents a chat member that has no additional privileges or restrictions.
 * @see https://core.telegram.org/bots/api#chatmembermember
 */
export type TgChatMemberMember = {
    /**
     * The member's status in the chat, always "member"
     *  */
    status: "member";
    /**
     * Information about the user
     *  */
    user: TgUser;
};
/**
 * Represents a chat member that is under certain restrictions in the chat. Supergroups only.
 * @see https://core.telegram.org/bots/api#chatmemberrestricted
 */
export type TgChatMemberRestricted = {
    /**
     * The member's status in the chat, always "restricted"
     *  */
    status: "restricted";
    /**
     * Information about the user
     *  */
    user: TgUser;
    /**
     * True, if the user is a member of the chat at the moment of the request
     *  */
    is_member: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     *  */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     *  */
    can_invite_users: boolean;
    /**
     * True, if the user is allowed to pin messages
     *  */
    can_pin_messages: boolean;
    /**
     * True, if the user is allowed to send text messages, contacts, locations and venues
     *  */
    can_send_messages: boolean;
    /**
     * True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes
     *  */
    can_send_media_messages: boolean;
    /**
     * True, if the user is allowed to send polls
     *  */
    can_send_polls: boolean;
    /**
     * True, if the user is allowed to send animations, games, stickers and use inline bots
     *  */
    can_send_other_messages: boolean;
    /**
     * True, if the user is allowed to add web page previews to their messages
     *  */
    can_add_web_page_previews: boolean;
    /**
     * Date when restrictions will be lifted for this user; unix time. If 0, then the user is restricted forever
     *  */
    until_date: number;
};
/**
 * Represents a chat member that isn't currently a member of the chat, but may join it themselves.
 * @see https://core.telegram.org/bots/api#chatmemberleft
 */
export type TgChatMemberLeft = {
    /**
     * The member's status in the chat, always "left"
     *  */
    status: "left";
    /**
     * Information about the user
     *  */
    user: TgUser;
};
/**
 * Represents a chat member that was banned in the chat and can't return to the chat or view chat messages.
 * @see https://core.telegram.org/bots/api#chatmemberbanned
 */
export type TgChatMemberBanned = {
    /**
     * The member's status in the chat, always "kicked"
     *  */
    status: "kicked";
    /**
     * Information about the user
     *  */
    user: TgUser;
    /**
     * Date when restrictions will be lifted for this user; unix time. If 0, then the user is banned forever
     *  */
    until_date: number;
};
/**
 * This object represents changes in the status of a chat member.
 * @see https://core.telegram.org/bots/api#chatmemberupdated
 */
export type TgChatMemberUpdated = {
    /**
     * Chat the user belongs to
     *  */
    chat: TgChat;
    /**
     * Performer of the action, which resulted in the change
     *  */
    from: TgUser;
    /**
     * Date the change was done in Unix time
     *  */
    date: number;
    /**
     * Previous information about the chat member
     *  */
    old_chat_member: TgChatMember;
    /**
     * New information about the chat member
     *  */
    new_chat_member: TgChatMember;
    /**
     * Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only.
     *  */
    invite_link?: TgChatInviteLink;
};
/**
 * Represents a join request sent to a chat.
 * @see https://core.telegram.org/bots/api#chatjoinrequest
 */
export type TgChatJoinRequest = {
    /**
     * Chat to which the request was sent
     *  */
    chat: TgChat;
    /**
     * User that sent the join request
     *  */
    from: TgUser;
    /**
     * Date the request was sent in Unix time
     *  */
    date: number;
    /**
     * Optional. Bio of the user.
     *  */
    bio?: string;
    /**
     * Optional. Chat invite link that was used by the user to send the join request
     *  */
    invite_link?: TgChatInviteLink;
};
/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 * @see https://core.telegram.org/bots/api#chatpermissions
 */
export type TgChatPermissions = {
    /**
     * Optional. True, if the user is allowed to send text messages, contacts, locations and venues
     *  */
    can_send_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
     *  */
    can_send_media_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to send polls, implies can_send_messages
     *  */
    can_send_polls?: boolean;
    /**
     * Optional. True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages
     *  */
    can_send_other_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages
     *  */
    can_add_web_page_previews?: boolean;
    /**
     * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups
     *  */
    can_change_info?: boolean;
    /**
     * Optional. True, if the user is allowed to invite new users to the chat
     *  */
    can_invite_users?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups
     *  */
    can_pin_messages?: boolean;
};
/**
 * Represents a location to which a chat is connected.
 * @see https://core.telegram.org/bots/api#chatlocation
 */
export type TgChatLocation = {
    /**
     * The location to which the supergroup is connected. Can't be a live location.
     *  */
    location: TgLocation;
    /**
     * Location address; 1-64 characters, as defined by the chat owner
     *  */
    address: string;
};
/**
 * This object represents a bot command.
 * @see https://core.telegram.org/bots/api#botcommand
 */
export type TgBotCommand = {
    /**
     * Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores.
     *  */
    command: string;
    /**
     * Description of the command; 1-256 characters.
     *  */
    description: string;
};
/**
 * This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported:
 * - BotCommandScopeDefault
 * - BotCommandScopeAllPrivateChats
 * - BotCommandScopeAllGroupChats
 * - BotCommandScopeAllChatAdministrators
 * - BotCommandScopeChat
 * - BotCommandScopeChatAdministrators
 * - BotCommandScopeChatMember
 * @see https://core.telegram.org/bots/api#botcommandscope
 */
export type TgBotCommandScope = TgBotCommandScopeDefault | TgBotCommandScopeAllPrivateChats | TgBotCommandScopeAllGroupChats | TgBotCommandScopeAllChatAdministrators | TgBotCommandScopeChat | TgBotCommandScopeChatAdministrators | TgBotCommandScopeChatMember;
/**
 * Represents the default scope of bot commands. Default commands are used if no commands with a narrower scope are specified for the user.
 * @see https://core.telegram.org/bots/api#botcommandscopedefault
 */
export type TgBotCommandScopeDefault = {
    /**
     * Scope type, must be default
     *  */
    type: "default";
};
/**
 * Represents the scope of bot commands, covering all private chats.
 * @see https://core.telegram.org/bots/api#botcommandscopeallprivatechats
 */
export type TgBotCommandScopeAllPrivateChats = {
    /**
     * Scope type, must be all_private_chats
     *  */
    type: "all_private_chats";
};
/**
 * Represents the scope of bot commands, covering all group and supergroup chats.
 * @see https://core.telegram.org/bots/api#botcommandscopeallgroupchats
 */
export type TgBotCommandScopeAllGroupChats = {
    /**
     * Scope type, must be all_group_chats
     *  */
    type: "all_group_chats";
};
/**
 * Represents the scope of bot commands, covering all group and supergroup chat administrators.
 * @see https://core.telegram.org/bots/api#botcommandscopeallchatadministrators
 */
export type TgBotCommandScopeAllChatAdministrators = {
    /**
     * Scope type, must be all_chat_administrators
     *  */
    type: "all_chat_administrators";
};
/**
 * Represents the scope of bot commands, covering a specific chat.
 * @see https://core.telegram.org/bots/api#botcommandscopechat
 */
export type TgBotCommandScopeChat = {
    /**
     * Scope type, must be chat
     *  */
    type: "chat";
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
};
/**
 * Represents the scope of bot commands, covering all administrators of a specific group or supergroup chat.
 * @see https://core.telegram.org/bots/api#botcommandscopechatadministrators
 */
export type TgBotCommandScopeChatAdministrators = {
    /**
     * Scope type, must be chat_administrators
     *  */
    type: "chat_administrators";
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
};
/**
 * Represents the scope of bot commands, covering a specific member of a group or supergroup chat.
 * @see https://core.telegram.org/bots/api#botcommandscopechatmember
 */
export type TgBotCommandScopeChatMember = {
    /**
     * Scope type, must be chat_member
     *  */
    type: "chat_member";
    /**
     * Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     *  */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     *  */
    user_id: number;
};
/**
 * This object describes the bot's menu button in a private chat. It should be one of
 * - MenuButtonCommands
 * - MenuButtonWebApp
 * - MenuButtonDefault
 * If a menu button other than MenuButtonDefault is set for a private chat, then it is applied in the chat. Otherwise the default menu button is applied. By default, the menu button opens the list of bot commands.
 * @see https://core.telegram.org/bots/api#menubutton
 */
export type TgMenuButton = TgMenuButtonCommands | TgMenuButtonWebApp | TgMenuButtonDefault;
/**
 * Represents a menu button, which opens the bot's list of commands.
 * @see https://core.telegram.org/bots/api#menubuttoncommands
 */
export type TgMenuButtonCommands = {
    /**
     * Type of the button, must be commands
     *  */
    type: "commands";
};
/**
 * Represents a menu button, which launches a Web App.
 * @see https://core.telegram.org/bots/api#menubuttonwebapp
 */
export type TgMenuButtonWebApp = {
    /**
     * Type of the button, must be web_app
     *  */
    type: "web_app";
    /**
     * Text on the button
     *  */
    text: string;
    /**
     * Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery.
     *  */
    web_app: TgWebAppInfo;
};
/**
 * Describes that no specific value for the menu button was set.
 * @see https://core.telegram.org/bots/api#menubuttondefault
 */
export type TgMenuButtonDefault = {
    /**
     * Type of the button, must be default
     *  */
    type: "default";
};
/**
 * Describes why a request was unsuccessful.
 * @see https://core.telegram.org/bots/api#responseparameters
 */
export type TgResponseParameters = {
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     *  */
    migrate_to_chat_id?: number;
    /**
     * Optional. In case of exceeding flood control, the number of seconds left to wait before the request can be repeated
     *  */
    retry_after?: number;
};
/**
 * This object represents the content of a media message to be sent. It should be one of
 * - InputMediaAnimation
 * - InputMediaDocument
 * - InputMediaAudio
 * - InputMediaPhoto
 * - InputMediaVideo
 * @see https://core.telegram.org/bots/api#inputmedia
 */
export type TgInputMedia = TgInputMediaAnimation | TgInputMediaDocument | TgInputMediaAudio | TgInputMediaPhoto | TgInputMediaVideo;
/**
 * Represents a photo to be sent.
 * @see https://core.telegram.org/bots/api#inputmediaphoto
 */
export type TgInputMediaPhoto = {
    /**
     * Type of the result, must be photo
     *  */
    type: "photo";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    media: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
};
/**
 * Represents a video to be sent.
 * @see https://core.telegram.org/bots/api#inputmediavideo
 */
export type TgInputMediaVideo = {
    /**
     * Type of the result, must be video
     *  */
    type: "video";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Video width
     *  */
    width?: number;
    /**
     * Optional. Video height
     *  */
    height?: number;
    /**
     * Optional. Video duration in seconds
     *  */
    duration?: number;
    /**
     * Optional. Pass True if the uploaded video is suitable for streaming
     *  */
    supports_streaming?: boolean;
};
/**
 * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.
 * @see https://core.telegram.org/bots/api#inputmediaanimation
 */
export type TgInputMediaAnimation = {
    /**
     * Type of the result, must be animation
     *  */
    type: "animation";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Optional. Caption of the animation to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the animation caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Animation width
     *  */
    width?: number;
    /**
     * Optional. Animation height
     *  */
    height?: number;
    /**
     * Optional. Animation duration in seconds
     *  */
    duration?: number;
};
/**
 * Represents an audio file to be treated as music to be sent.
 * @see https://core.telegram.org/bots/api#inputmediaaudio
 */
export type TgInputMediaAudio = {
    /**
     * Type of the result, must be audio
     *  */
    type: "audio";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Optional. Caption of the audio to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Duration of the audio in seconds
     *  */
    duration?: number;
    /**
     * Optional. Performer of the audio
     *  */
    performer?: string;
    /**
     * Optional. Title of the audio
     *  */
    title?: string;
};
/**
 * Represents a general file to be sent.
 * @see https://core.telegram.org/bots/api#inputmediadocument
 */
export type TgInputMediaDocument = {
    /**
     * Type of the result, must be document
     *  */
    type: "document";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files
     *  */
    thumb?: TgInputFile | string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always True, if the document is sent as part of an album.
     *  */
    disable_content_type_detection?: boolean;
};
/**
 * This object represents the contents of a file to be uploaded. Must be posted using multipart/form-data in the usual way that files are uploaded via the browser.
 * @see https://core.telegram.org/bots/api#inputfile
 */
export type TgInputFile = Blob;
/**
 * This object represents a sticker.
 * @see https://core.telegram.org/bots/api#sticker
 */
export type TgSticker = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * Type of the sticker, currently one of "regular", "mask", "custom_emoji". The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video.
     *  */
    type: "regular" | "mask" | "custom_emoji";
    /**
     * Sticker width
     *  */
    width: number;
    /**
     * Sticker height
     *  */
    height: number;
    /**
     * True, if the sticker is animated
     *  */
    is_animated: boolean;
    /**
     * True, if the sticker is a video sticker
     *  */
    is_video: boolean;
    /**
     * Optional. Sticker thumbnail in the .WEBP or .JPG format
     *  */
    thumb?: TgPhotoSize;
    /**
     * Optional. Emoji associated with the sticker
     *  */
    emoji?: string;
    /**
     * Optional. Name of the sticker set to which the sticker belongs
     *  */
    set_name?: string;
    /**
     * Optional. For premium regular stickers, premium animation for the sticker
     *  */
    premium_animation?: TgFile;
    /**
     * Optional. For mask stickers, the position where the mask should be placed
     *  */
    mask_position?: TgMaskPosition;
    /**
     * Optional. For custom emoji stickers, unique identifier of the custom emoji
     *  */
    custom_emoji_id?: string;
    /**
     * Optional. File size in bytes
     *  */
    file_size?: number;
};
/**
 * This object represents a sticker set.
 * @see https://core.telegram.org/bots/api#stickerset
 */
export type TgStickerSet = {
    /**
     * Sticker set name
     *  */
    name: string;
    /**
     * Sticker set title
     *  */
    title: string;
    /**
     * Type of stickers in the set, currently one of "regular", "mask", "custom_emoji"
     *  */
    sticker_type: "regular" | "mask" | "custom_emoji";
    /**
     * True, if the sticker set contains animated stickers
     *  */
    is_animated: boolean;
    /**
     * True, if the sticker set contains video stickers
     *  */
    is_video: boolean;
    /**
     * List of all set stickers
     *  */
    stickers: TgSticker[];
    /**
     * Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format
     *  */
    thumb?: TgPhotoSize;
};
/**
 * This object describes the position on faces where a mask should be placed by default.
 * @see https://core.telegram.org/bots/api#maskposition
 */
export type TgMaskPosition = {
    /**
     * The part of the face relative to which the mask should be placed. One of "forehead", "eyes", "mouth", or "chin".
     *  */
    point: "forehead" | "eyes" | "mouth" | "chin";
    /**
     * Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.
     *  */
    x_shift: number;
    /**
     * Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.
     *  */
    y_shift: number;
    /**
     * Mask scaling coefficient. For example, 2.0 means double size.
     *  */
    scale: number;
};
/**
 * This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.
 * @see https://core.telegram.org/bots/api#inlinequery
 */
export type TgInlineQuery = {
    /**
     * Unique identifier for this query
     *  */
    id: string;
    /**
     * Sender
     *  */
    from: TgUser;
    /**
     * Text of the query (up to 256 characters)
     *  */
    query: string;
    /**
     * Offset of the results to be returned, can be controlled by the bot
     *  */
    offset: string;
    /**
     * Optional. Type of the chat from which the inline query was sent. Can be either "sender" for a private chat with the inline query sender, "private", "group", "supergroup", or "channel". The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat
     *  */
    chat_type?: "sender" | "private" | "group" | "supergroup" | "channel";
    /**
     * Optional. Sender location, only for bots that request user location
     *  */
    location?: TgLocation;
};
/**
 * This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:
 * - InlineQueryResultCachedAudio
 * - InlineQueryResultCachedDocument
 * - InlineQueryResultCachedGif
 * - InlineQueryResultCachedMpeg4Gif
 * - InlineQueryResultCachedPhoto
 * - InlineQueryResultCachedSticker
 * - InlineQueryResultCachedVideo
 * - InlineQueryResultCachedVoice
 * - InlineQueryResultArticle
 * - InlineQueryResultAudio
 * - InlineQueryResultContact
 * - InlineQueryResultGame
 * - InlineQueryResultDocument
 * - InlineQueryResultGif
 * - InlineQueryResultLocation
 * - InlineQueryResultMpeg4Gif
 * - InlineQueryResultPhoto
 * - InlineQueryResultVenue
 * - InlineQueryResultVideo
 * - InlineQueryResultVoice
 * Note: All URLs passed in inline query results will be available to end users and therefore must be assumed to be public.
 * @see https://core.telegram.org/bots/api#inlinequeryresult
 */
export type TgInlineQueryResult = TgInlineQueryResultCachedAudio | TgInlineQueryResultCachedDocument | TgInlineQueryResultCachedGif | TgInlineQueryResultCachedMpeg4Gif | TgInlineQueryResultCachedPhoto | TgInlineQueryResultCachedSticker | TgInlineQueryResultCachedVideo | TgInlineQueryResultCachedVoice | TgInlineQueryResultArticle | TgInlineQueryResultAudio | TgInlineQueryResultContact | TgInlineQueryResultGame | TgInlineQueryResultDocument | TgInlineQueryResultGif | TgInlineQueryResultLocation | TgInlineQueryResultMpeg4Gif | TgInlineQueryResultPhoto | TgInlineQueryResultVenue | TgInlineQueryResultVideo | TgInlineQueryResultVoice;
/**
 * Represents a link to an article or web page.
 * @see https://core.telegram.org/bots/api#inlinequeryresultarticle
 */
export type TgInlineQueryResultArticle = {
    /**
     * Type of the result, must be article
     *  */
    type: "article";
    /**
     * Unique identifier for this result, 1-64 Bytes
     *  */
    id: string;
    /**
     * Title of the result
     *  */
    title: string;
    /**
     * Content of the message to be sent
     *  */
    input_message_content: TgInputMessageContent;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. URL of the result
     *  */
    url?: string;
    /**
     * Optional. Pass True if you don't want the URL to be shown in the message
     *  */
    hide_url?: boolean;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Url of the thumbnail for the result
     *  */
    thumb_url?: string;
    /**
     * Optional. Thumbnail width
     *  */
    thumb_width?: number;
    /**
     * Optional. Thumbnail height
     *  */
    thumb_height?: number;
};
/**
 * Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
 * @see https://core.telegram.org/bots/api#inlinequeryresultphoto
 */
export type TgInlineQueryResultPhoto = {
    /**
     * Type of the result, must be photo
     *  */
    type: "photo";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB
     *  */
    photo_url: string;
    /**
     * URL of the thumbnail for the photo
     *  */
    thumb_url: string;
    /**
     * Optional. Width of the photo
     *  */
    photo_width?: number;
    /**
     * Optional. Height of the photo
     *  */
    photo_height?: number;
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the photo
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 * @see https://core.telegram.org/bots/api#inlinequeryresultgif
 */
export type TgInlineQueryResultGif = {
    /**
     * Type of the result, must be gif
     *  */
    type: "gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL for the GIF file. File size must not exceed 1MB
     *  */
    gif_url: string;
    /**
     * Optional. Width of the GIF
     *  */
    gif_width?: number;
    /**
     * Optional. Height of the GIF
     *  */
    gif_height?: number;
    /**
     * Optional. Duration of the GIF in seconds
     *  */
    gif_duration?: number;
    /**
     * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     *  */
    thumb_url: string;
    /**
     * Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg"
     *  */
    thumb_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the GIF animation
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 * @see https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif
 */
export type TgInlineQueryResultMpeg4Gif = {
    /**
     * Type of the result, must be mpeg4_gif
     *  */
    type: "mpeg4_gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL for the MPEG4 file. File size must not exceed 1MB
     *  */
    mpeg4_url: string;
    /**
     * Optional. Video width
     *  */
    mpeg4_width?: number;
    /**
     * Optional. Video height
     *  */
    mpeg4_height?: number;
    /**
     * Optional. Video duration in seconds
     *  */
    mpeg4_duration?: number;
    /**
     * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     *  */
    thumb_url: string;
    /**
     * Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg"
     *  */
    thumb_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video animation
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
 * @see https://core.telegram.org/bots/api#inlinequeryresultvideo
 */
export type TgInlineQueryResultVideo = {
    /**
     * Type of the result, must be video
     *  */
    type: "video";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL for the embedded video player or video file
     *  */
    video_url: string;
    /**
     * MIME type of the content of the video URL, "text/html" or "video/mp4"
     *  */
    mime_type: string;
    /**
     * URL of the thumbnail (JPEG only) for the video
     *  */
    thumb_url: string;
    /**
     * Title for the result
     *  */
    title: string;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Video width
     *  */
    video_width?: number;
    /**
     * Optional. Video height
     *  */
    video_height?: number;
    /**
     * Optional. Video duration in seconds
     *  */
    video_duration?: number;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultaudio
 */
export type TgInlineQueryResultAudio = {
    /**
     * Type of the result, must be audio
     *  */
    type: "audio";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL for the audio file
     *  */
    audio_url: string;
    /**
     * Title
     *  */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Performer
     *  */
    performer?: string;
    /**
     * Optional. Audio duration in seconds
     *  */
    audio_duration?: number;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the audio
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultvoice
 */
export type TgInlineQueryResultVoice = {
    /**
     * Type of the result, must be voice
     *  */
    type: "voice";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid URL for the voice recording
     *  */
    voice_url: string;
    /**
     * Recording title
     *  */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Recording duration in seconds
     *  */
    voice_duration?: number;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the voice recording
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultdocument
 */
export type TgInlineQueryResultDocument = {
    /**
     * Type of the result, must be document
     *  */
    type: "document";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * Title for the result
     *  */
    title: string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * A valid URL for the file
     *  */
    document_url: string;
    /**
     * MIME type of the content of the file, either "application/pdf" or "application/zip"
     *  */
    mime_type: "application/pdf" | "application/zip";
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the file
     *  */
    input_message_content?: TgInputMessageContent;
    /**
     * Optional. URL of the thumbnail (JPEG only) for the file
     *  */
    thumb_url?: string;
    /**
     * Optional. Thumbnail width
     *  */
    thumb_width?: number;
    /**
     * Optional. Thumbnail height
     *  */
    thumb_height?: number;
};
/**
 * Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultlocation
 */
export type TgInlineQueryResultLocation = {
    /**
     * Type of the result, must be location
     *  */
    type: "location";
    /**
     * Unique identifier for this result, 1-64 Bytes
     *  */
    id: string;
    /**
     * Location latitude in degrees
     *  */
    latitude: number;
    /**
     * Location longitude in degrees
     *  */
    longitude: number;
    /**
     * Location title
     *  */
    title: string;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     *  */
    horizontal_accuracy?: number;
    /**
     * Optional. Period in seconds for which the location can be updated, should be between 60 and 86400.
     *  */
    live_period?: number;
    /**
     * Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     *  */
    heading?: number;
    /**
     * Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     *  */
    proximity_alert_radius?: number;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the location
     *  */
    input_message_content?: TgInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     *  */
    thumb_url?: string;
    /**
     * Optional. Thumbnail width
     *  */
    thumb_width?: number;
    /**
     * Optional. Thumbnail height
     *  */
    thumb_height?: number;
};
/**
 * Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultvenue
 */
export type TgInlineQueryResultVenue = {
    /**
     * Type of the result, must be venue
     *  */
    type: "venue";
    /**
     * Unique identifier for this result, 1-64 Bytes
     *  */
    id: string;
    /**
     * Latitude of the venue location in degrees
     *  */
    latitude: number;
    /**
     * Longitude of the venue location in degrees
     *  */
    longitude: number;
    /**
     * Title of the venue
     *  */
    title: string;
    /**
     * Address of the venue
     *  */
    address: string;
    /**
     * Optional. Foursquare identifier of the venue if known
     *  */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
     *  */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     *  */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     *  */
    google_place_type?: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the venue
     *  */
    input_message_content?: TgInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     *  */
    thumb_url?: string;
    /**
     * Optional. Thumbnail width
     *  */
    thumb_width?: number;
    /**
     * Optional. Thumbnail height
     *  */
    thumb_height?: number;
};
/**
 * Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcontact
 */
export type TgInlineQueryResultContact = {
    /**
     * Type of the result, must be contact
     *  */
    type: "contact";
    /**
     * Unique identifier for this result, 1-64 Bytes
     *  */
    id: string;
    /**
     * Contact's phone number
     *  */
    phone_number: string;
    /**
     * Contact's first name
     *  */
    first_name: string;
    /**
     * Optional. Contact's last name
     *  */
    last_name?: string;
    /**
     * Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes
     *  */
    vcard?: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the contact
     *  */
    input_message_content?: TgInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     *  */
    thumb_url?: string;
    /**
     * Optional. Thumbnail width
     *  */
    thumb_width?: number;
    /**
     * Optional. Thumbnail height
     *  */
    thumb_height?: number;
};
/**
 * Represents a Game.
 * Note: This will only work in Telegram versions released after October 1, 2016. Older clients will not display any inline results if a game result is among them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultgame
 */
export type TgInlineQueryResultGame = {
    /**
     * Type of the result, must be game
     *  */
    type: "game";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * Short name of the game
     *  */
    game_short_name: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
};
/**
 * Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedphoto
 */
export type TgInlineQueryResultCachedPhoto = {
    /**
     * Type of the result, must be photo
     *  */
    type: "photo";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier of the photo
     *  */
    photo_file_id: string;
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the photo
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedgif
 */
export type TgInlineQueryResultCachedGif = {
    /**
     * Type of the result, must be gif
     *  */
    type: "gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier for the GIF file
     *  */
    gif_file_id: string;
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the GIF animation
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedmpeg4gif
 */
export type TgInlineQueryResultCachedMpeg4Gif = {
    /**
     * Type of the result, must be mpeg4_gif
     *  */
    type: "mpeg4_gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier for the MPEG4 file
     *  */
    mpeg4_file_id: string;
    /**
     * Optional. Title for the result
     *  */
    title?: string;
    /**
     * Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video animation
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker.
 * Note: This will only work in Telegram versions released after 9 April, 2016 for static stickers and after 06 July, 2019 for animated stickers. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedsticker
 */
export type TgInlineQueryResultCachedSticker = {
    /**
     * Type of the result, must be sticker
     *  */
    type: "sticker";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier of the sticker
     *  */
    sticker_file_id: string;
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the sticker
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcacheddocument
 */
export type TgInlineQueryResultCachedDocument = {
    /**
     * Type of the result, must be document
     *  */
    type: "document";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * Title for the result
     *  */
    title: string;
    /**
     * A valid file identifier for the file
     *  */
    document_file_id: string;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the file
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedvideo
 */
export type TgInlineQueryResultCachedVideo = {
    /**
     * Type of the result, must be video
     *  */
    type: "video";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier for the video file
     *  */
    video_file_id: string;
    /**
     * Title for the result
     *  */
    title: string;
    /**
     * Optional. Short description of the result
     *  */
    description?: string;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedvoice
 */
export type TgInlineQueryResultCachedVoice = {
    /**
     * Type of the result, must be voice
     *  */
    type: "voice";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier for the voice message
     *  */
    voice_file_id: string;
    /**
     * Voice message title
     *  */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the voice message
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
 * Note: This will only work in Telegram versions released after 9 April, 2016. Older clients will ignore them.
 * @see https://core.telegram.org/bots/api#inlinequeryresultcachedaudio
 */
export type TgInlineQueryResultCachedAudio = {
    /**
     * Type of the result, must be audio
     *  */
    type: "audio";
    /**
     * Unique identifier for this result, 1-64 bytes
     *  */
    id: string;
    /**
     * A valid file identifier for the audio file
     *  */
    audio_file_id: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     *  */
    caption?: string;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     *  */
    caption_entities?: TgMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     *  */
    reply_markup?: TgInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the audio
     *  */
    input_message_content?: TgInputMessageContent;
};
/**
 * This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following 5 types:
 * - InputTextMessageContent
 * - InputLocationMessageContent
 * - InputVenueMessageContent
 * - InputContactMessageContent
 * - InputInvoiceMessageContent
 * @see https://core.telegram.org/bots/api#inputmessagecontent
 */
export type TgInputMessageContent = TgInputTextMessageContent | TgInputLocationMessageContent | TgInputVenueMessageContent | TgInputContactMessageContent | TgInputInvoiceMessageContent;
/**
 * Represents the content of a text message to be sent as the result of an inline query.
 * @see https://core.telegram.org/bots/api#inputtextmessagecontent
 */
export type TgInputTextMessageContent = {
    /**
     * Text of the message to be sent, 1-4096 characters
     *  */
    message_text: string;
    /**
     * Optional. Mode for parsing entities in the message text. See formatting options for more details.
     *  */
    parse_mode?: string;
    /**
     * Optional. List of special entities that appear in message text, which can be specified instead of parse_mode
     *  */
    entities?: TgMessageEntity[];
    /**
     * Optional. Disables link previews for links in the sent message
     *  */
    disable_web_page_preview?: boolean;
};
/**
 * Represents the content of a location message to be sent as the result of an inline query.
 * @see https://core.telegram.org/bots/api#inputlocationmessagecontent
 */
export type TgInputLocationMessageContent = {
    /**
     * Latitude of the location in degrees
     *  */
    latitude: number;
    /**
     * Longitude of the location in degrees
     *  */
    longitude: number;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     *  */
    horizontal_accuracy?: number;
    /**
     * Optional. Period in seconds for which the location can be updated, should be between 60 and 86400.
     *  */
    live_period?: number;
    /**
     * Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     *  */
    heading?: number;
    /**
     * Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     *  */
    proximity_alert_radius?: number;
};
/**
 * Represents the content of a venue message to be sent as the result of an inline query.
 * @see https://core.telegram.org/bots/api#inputvenuemessagecontent
 */
export type TgInputVenueMessageContent = {
    /**
     * Latitude of the venue in degrees
     *  */
    latitude: number;
    /**
     * Longitude of the venue in degrees
     *  */
    longitude: number;
    /**
     * Name of the venue
     *  */
    title: string;
    /**
     * Address of the venue
     *  */
    address: string;
    /**
     * Optional. Foursquare identifier of the venue, if known
     *  */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
     *  */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     *  */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     *  */
    google_place_type?: string;
};
/**
 * Represents the content of a contact message to be sent as the result of an inline query.
 * @see https://core.telegram.org/bots/api#inputcontactmessagecontent
 */
export type TgInputContactMessageContent = {
    /**
     * Contact's phone number
     *  */
    phone_number: string;
    /**
     * Contact's first name
     *  */
    first_name: string;
    /**
     * Optional. Contact's last name
     *  */
    last_name?: string;
    /**
     * Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes
     *  */
    vcard?: string;
};
/**
 * Represents the content of an invoice message to be sent as the result of an inline query.
 * @see https://core.telegram.org/bots/api#inputinvoicemessagecontent
 */
export type TgInputInvoiceMessageContent = {
    /**
     * Product name, 1-32 characters
     *  */
    title: string;
    /**
     * Product description, 1-255 characters
     *  */
    description: string;
    /**
     * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     *  */
    payload: string;
    /**
     * Payment provider token, obtained via @BotFather
     *  */
    provider_token: string;
    /**
     * Three-letter ISO 4217 currency code, see more on currencies
     *  */
    currency: string;
    /**
     * Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     *  */
    prices: TgLabeledPrice[];
    /**
     * Optional. The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0
     *  */
    max_tip_amount?: number;
    /**
     * Optional. A JSON-serialized array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     *  */
    suggested_tip_amounts?: number[];
    /**
     * Optional. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider.
     *  */
    provider_data?: string;
    /**
     * Optional. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.
     *  */
    photo_url?: string;
    /**
     * Optional. Photo size in bytes
     *  */
    photo_size?: number;
    /**
     * Optional. Photo width
     *  */
    photo_width?: number;
    /**
     * Optional. Photo height
     *  */
    photo_height?: number;
    /**
     * Optional. Pass True if you require the user's full name to complete the order
     *  */
    need_name?: boolean;
    /**
     * Optional. Pass True if you require the user's phone number to complete the order
     *  */
    need_phone_number?: boolean;
    /**
     * Optional. Pass True if you require the user's email address to complete the order
     *  */
    need_email?: boolean;
    /**
     * Optional. Pass True if you require the user's shipping address to complete the order
     *  */
    need_shipping_address?: boolean;
    /**
     * Optional. Pass True if the user's phone number should be sent to provider
     *  */
    send_phone_number_to_provider?: boolean;
    /**
     * Optional. Pass True if the user's email address should be sent to provider
     *  */
    send_email_to_provider?: boolean;
    /**
     * Optional. Pass True if the final price depends on the shipping method
     *  */
    is_flexible?: boolean;
};
/**
 * Represents a result of an inline query that was chosen by the user and sent to their chat partner.
 * Note: It is necessary to enable inline feedback via @BotFather in order to receive these objects in updates.
 * @see https://core.telegram.org/bots/api#choseninlineresult
 */
export type TgChosenInlineResult = {
    /**
     * The unique identifier for the result that was chosen
     *  */
    result_id: string;
    /**
     * The user that chose the result
     *  */
    from: TgUser;
    /**
     * Optional. Sender location, only for bots that require user location
     *  */
    location?: TgLocation;
    /**
     * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message.
     *  */
    inline_message_id?: string;
    /**
     * The query that was used to obtain the result
     *  */
    query: string;
};
/**
 * Describes an inline message sent by a Web App on behalf of a user.
 * @see https://core.telegram.org/bots/api#sentwebappmessage
 */
export type TgSentWebAppMessage = {
    /**
     * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message.
     *  */
    inline_message_id?: string;
};
/**
 * This object represents a portion of the price for goods or services.
 * @see https://core.telegram.org/bots/api#labeledprice
 */
export type TgLabeledPrice = {
    /**
     * Portion label
     *  */
    label: string;
    /**
     * Price of the product in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     *  */
    amount: number;
};
/**
 * This object contains basic information about an invoice.
 * @see https://core.telegram.org/bots/api#invoice
 */
export type TgInvoice = {
    /**
     * Product name
     *  */
    title: string;
    /**
     * Product description
     *  */
    description: string;
    /**
     * Unique bot deep-linking parameter that can be used to generate this invoice
     *  */
    start_parameter: string;
    /**
     * Three-letter ISO 4217 currency code
     *  */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     *  */
    total_amount: number;
};
/**
 * This object represents a shipping address.
 * @see https://core.telegram.org/bots/api#shippingaddress
 */
export type TgShippingAddress = {
    /**
     * Two-letter ISO 3166-1 alpha-2 country code
     *  */
    country_code: string;
    /**
     * State, if applicable
     *  */
    state: string;
    /**
     * City
     *  */
    city: string;
    /**
     * First line for the address
     *  */
    street_line1: string;
    /**
     * Second line for the address
     *  */
    street_line2: string;
    /**
     * Address post code
     *  */
    post_code: string;
};
/**
 * This object represents information about an order.
 * @see https://core.telegram.org/bots/api#orderinfo
 */
export type TgOrderInfo = {
    /**
     * Optional. User name
     *  */
    name?: string;
    /**
     * Optional. User's phone number
     *  */
    phone_number?: string;
    /**
     * Optional. User email
     *  */
    email?: string;
    /**
     * Optional. User shipping address
     *  */
    shipping_address?: TgShippingAddress;
};
/**
 * This object represents one shipping option.
 * @see https://core.telegram.org/bots/api#shippingoption
 */
export type TgShippingOption = {
    /**
     * Shipping option identifier
     *  */
    id: string;
    /**
     * Option title
     *  */
    title: string;
    /**
     * List of price portions
     *  */
    prices: TgLabeledPrice[];
};
/**
 * This object contains basic information about a successful payment.
 * @see https://core.telegram.org/bots/api#successfulpayment
 */
export type TgSuccessfulPayment = {
    /**
     * Three-letter ISO 4217 currency code
     *  */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     *  */
    total_amount: number;
    /**
     * Bot specified invoice payload
     *  */
    invoice_payload: string;
    /**
     * Optional. Identifier of the shipping option chosen by the user
     *  */
    shipping_option_id?: string;
    /**
     * Optional. Order information provided by the user
     *  */
    order_info?: TgOrderInfo;
    /**
     * Telegram payment identifier
     *  */
    telegram_payment_charge_id: string;
    /**
     * Provider payment identifier
     *  */
    provider_payment_charge_id: string;
};
/**
 * This object contains information about an incoming shipping query.
 * @see https://core.telegram.org/bots/api#shippingquery
 */
export type TgShippingQuery = {
    /**
     * Unique query identifier
     *  */
    id: string;
    /**
     * User who sent the query
     *  */
    from: TgUser;
    /**
     * Bot specified invoice payload
     *  */
    invoice_payload: string;
    /**
     * User specified shipping address
     *  */
    shipping_address: TgShippingAddress;
};
/**
 * This object contains information about an incoming pre-checkout query.
 * @see https://core.telegram.org/bots/api#precheckoutquery
 */
export type TgPreCheckoutQuery = {
    /**
     * Unique query identifier
     *  */
    id: string;
    /**
     * User who sent the query
     *  */
    from: TgUser;
    /**
     * Three-letter ISO 4217 currency code
     *  */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     *  */
    total_amount: number;
    /**
     * Bot specified invoice payload
     *  */
    invoice_payload: string;
    /**
     * Optional. Identifier of the shipping option chosen by the user
     *  */
    shipping_option_id?: string;
    /**
     * Optional. Order information provided by the user
     *  */
    order_info?: TgOrderInfo;
};
/**
 * Describes Telegram Passport data shared with the bot by the user.
 * @see https://core.telegram.org/bots/api#passportdata
 */
export type TgPassportData = {
    /**
     * Array with information about documents and other Telegram Passport elements that was shared with the bot
     *  */
    data: TgEncryptedPassportElement[];
    /**
     * Encrypted credentials required to decrypt the data
     *  */
    credentials: TgEncryptedCredentials;
};
/**
 * This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don't exceed 10MB.
 * @see https://core.telegram.org/bots/api#passportfile
 */
export type TgPassportFile = {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     *  */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     *  */
    file_unique_id: string;
    /**
     * File size in bytes
     *  */
    file_size: number;
    /**
     * Unix time when the file was uploaded
     *  */
    file_date: number;
};
/**
 * Describes documents or other Telegram Passport elements shared with the bot by the user.
 * @see https://core.telegram.org/bots/api#encryptedpassportelement
 */
export type TgEncryptedPassportElement = {
    /**
     * Element type. One of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration", "phone_number", "email".
     *  */
    type: "personal_details" | "passport" | "driver_license" | "identity_card" | "internal_passport" | "address" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration" | "phone_number" | "email";
    /**
     * Optional. Base64-encoded encrypted Telegram Passport element data provided by the user, available for "personal_details", "passport", "driver_license", "identity_card", "internal_passport" and "address" types. Can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    data?: string;
    /**
     * Optional. User's verified phone number, available only for "phone_number" type
     *  */
    phone_number?: string;
    /**
     * Optional. User's verified email address, available only for "email" type
     *  */
    email?: string;
    /**
     * Optional. Array of encrypted files with documents provided by the user, available for "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    files?: TgPassportFile[];
    /**
     * Optional. Encrypted file with the front side of the document, provided by the user. Available for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    front_side?: TgPassportFile;
    /**
     * Optional. Encrypted file with the reverse side of the document, provided by the user. Available for "driver_license" and "identity_card". The file can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    reverse_side?: TgPassportFile;
    /**
     * Optional. Encrypted file with the selfie of the user holding a document, provided by the user; available for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    selfie?: TgPassportFile;
    /**
     * Optional. Array of encrypted files with translated versions of documents provided by the user. Available if requested for "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials.
     *  */
    translation?: TgPassportFile[];
    /**
     * Base64-encoded element hash for using in PassportElementErrorUnspecified
     *  */
    hash: string;
};
/**
 * Describes data required for decrypting and authenticating EncryptedPassportElement. See the Telegram Passport Documentation for a complete description of the data decryption and authentication processes.
 * @see https://core.telegram.org/bots/api#encryptedcredentials
 */
export type TgEncryptedCredentials = {
    /**
     * Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedPassportElement decryption and authentication
     *  */
    data: string;
    /**
     * Base64-encoded data hash for data authentication
     *  */
    hash: string;
    /**
     * Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption
     *  */
    secret: string;
};
/**
 * This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:
 * - PassportElementErrorDataField
 * - PassportElementErrorFrontSide
 * - PassportElementErrorReverseSide
 * - PassportElementErrorSelfie
 * - PassportElementErrorFile
 * - PassportElementErrorFiles
 * - PassportElementErrorTranslationFile
 * - PassportElementErrorTranslationFiles
 * - PassportElementErrorUnspecified
 * @see https://core.telegram.org/bots/api#passportelementerror
 */
export type TgPassportElementError = TgPassportElementErrorDataField | TgPassportElementErrorFrontSide | TgPassportElementErrorReverseSide | TgPassportElementErrorSelfie | TgPassportElementErrorFile | TgPassportElementErrorFiles | TgPassportElementErrorTranslationFile | TgPassportElementErrorTranslationFiles | TgPassportElementErrorUnspecified;
/**
 * Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field's value changes.
 * @see https://core.telegram.org/bots/api#passportelementerrordatafield
 */
export type TgPassportElementErrorDataField = {
    /**
     * Error source, must be data
     *  */
    source: "data";
    /**
     * The section of the user's Telegram Passport which has the error, one of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address"
     *  */
    type: "personal_details" | "passport" | "driver_license" | "identity_card" | "internal_passport" | "address";
    /**
     * Name of the data field which has the error
     *  */
    field_name: string;
    /**
     * Base64-encoded data hash
     *  */
    data_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.
 * @see https://core.telegram.org/bots/api#passportelementerrorfrontside
 */
export type TgPassportElementErrorFrontSide = {
    /**
     * Error source, must be front_side
     *  */
    source: "front_side";
    /**
     * The section of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport"
     *  */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /**
     * Base64-encoded hash of the file with the front side of the document
     *  */
    file_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.
 * @see https://core.telegram.org/bots/api#passportelementerrorreverseside
 */
export type TgPassportElementErrorReverseSide = {
    /**
     * Error source, must be reverse_side
     *  */
    source: "reverse_side";
    /**
     * The section of the user's Telegram Passport which has the issue, one of "driver_license", "identity_card"
     *  */
    type: "driver_license" | "identity_card";
    /**
     * Base64-encoded hash of the file with the reverse side of the document
     *  */
    file_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.
 * @see https://core.telegram.org/bots/api#passportelementerrorselfie
 */
export type TgPassportElementErrorSelfie = {
    /**
     * Error source, must be selfie
     *  */
    source: "selfie";
    /**
     * The section of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport"
     *  */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /**
     * Base64-encoded hash of the file with the selfie
     *  */
    file_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.
 * @see https://core.telegram.org/bots/api#passportelementerrorfile
 */
export type TgPassportElementErrorFile = {
    /**
     * Error source, must be file
     *  */
    source: "file";
    /**
     * The section of the user's Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"
     *  */
    type: "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * Base64-encoded file hash
     *  */
    file_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.
 * @see https://core.telegram.org/bots/api#passportelementerrorfiles
 */
export type TgPassportElementErrorFiles = {
    /**
     * Error source, must be files
     *  */
    source: "files";
    /**
     * The section of the user's Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"
     *  */
    type: "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * List of base64-encoded file hashes
     *  */
    file_hashes: string[];
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.
 * @see https://core.telegram.org/bots/api#passportelementerrortranslationfile
 */
export type TgPassportElementErrorTranslationFile = {
    /**
     * Error source, must be translation_file
     *  */
    source: "translation_file";
    /**
     * Type of element of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"
     *  */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * Base64-encoded file hash
     *  */
    file_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.
 * @see https://core.telegram.org/bots/api#passportelementerrortranslationfiles
 */
export type TgPassportElementErrorTranslationFiles = {
    /**
     * Error source, must be translation_files
     *  */
    source: "translation_files";
    /**
     * Type of element of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"
     *  */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * List of base64-encoded file hashes
     *  */
    file_hashes: string[];
    /**
     * Error message
     *  */
    message: string;
};
/**
 * Represents an issue in an unspecified place. The error is considered resolved when new data is added.
 * @see https://core.telegram.org/bots/api#passportelementerrorunspecified
 */
export type TgPassportElementErrorUnspecified = {
    /**
     * Error source, must be unspecified
     *  */
    source: "unspecified";
    /**
     * Type of element of the user's Telegram Passport which has the issue
     *  */
    type: string;
    /**
     * Base64-encoded element hash
     *  */
    element_hash: string;
    /**
     * Error message
     *  */
    message: string;
};
/**
 * This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.
 * @see https://core.telegram.org/bots/api#game
 */
export type TgGame = {
    /**
     * Title of the game
     *  */
    title: string;
    /**
     * Description of the game
     *  */
    description: string;
    /**
     * Photo that will be displayed in the game message in chats.
     *  */
    photo: TgPhotoSize[];
    /**
     * Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters.
     *  */
    text?: string;
    /**
     * Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.
     *  */
    text_entities?: TgMessageEntity[];
    /**
     * Optional. Animation that will be displayed in the game message in chats. Upload via BotFather
     *  */
    animation?: TgAnimation;
};
/**
 * A placeholder, currently holds no information. Use BotFather to set up your game.
 * @see https://core.telegram.org/bots/api#callbackgame
 */
export type TgCallbackGame = {};
/**
 * This object represents one row of the high scores table for a game.
 * @see https://core.telegram.org/bots/api#gamehighscore
 */
export type TgGameHighScore = {
    /**
     * Position in high score table for the game
     *  */
    position: number;
    /**
     * User
     *  */
    user: TgUser;
    /**
     * Score
     *  */
    score: number;
};
