import "./style.css";

import definePlugin from "@utils/types";
import { settings } from "./settings";
import { Nameplate, usersStore } from "./lib/storage";
import { UserStore } from "@webpack/common";
import { User } from "@vencord/discord-types";
import { usersProfileBadges } from "./lib/badges";

export default definePlugin({
    name: "fakeProfile",
    description: "Displays banner, avatar, nameplate, profile colors things without Nitro.",
    authors: [{
        name: "Alpenjäger",
        id: 849335684161601546n,
    }],
    tags: ["Appearance", "Customisation"],
    dependencies: ["FakeProfileThemes", "BadgeAPI"], // "FakeProfileThemes" - we don't need to copy-paste this anymore, btw.
    settings,
    async start() {
        if (settings.store.enableCustomBadges) {
            usersProfileBadges.getState().fetchBadges();
        }
        usersStore.getState().fetch(UserStore.getCurrentUser().id, true);
    },
    patches: [
        {
            find: ':"SHOULD_LOAD");',
            replacement: {
                match: /\i(?:\?)?.getPreviewBanner\(\i,\i,\i\)(?=.{0,100}"COMPLETE")/,
                replace: "$self.patchBannerUrl(arguments[0])||$&"

            }
        },
        {
            find: "\"data-selenium-video-tile\":",
            replacement: [
                {
                    // FIXME: Stable compat: (?: \i)?
                    match: /(?<=function(?: \i)?\((\i)\)\{)(?=let.{20,40},style:)/,
                    replace: "Object.assign($1.style=$1.style||{},$self.getVoiceBackgroundStyles($1));"
                }
            ]
        },
        {
            find: ".VIDEO_TILE_BACKGROUND,primaryColor:",
            predicate: () => settings.store.voiceBackground,
            replacement: {
                match: /backgroundColor:.{0,25},\{style:(?=\i\?)/,
                replace: "$&$self.userExists(arguments[0]?.userId)?null:",
            }
        },
        {
            find: "getUserAvatarURL:",
            predicate: () => settings.store.showAvatar,
            replacement: [
                {
                    match: /(getUserAvatarURL:)(\i),/,
                    replace: "$1$self.getAvatarHook($2),"
                },
            ]
        },
        {
            find: "#{intl::GUILD_OWNER}),",
            predicate: () => settings.store.preferNameplate,
            replacement: [
                {
                    // Orginal note(not mine): We add the banner as a property while we can still access the user id
                    match: /user:(\i).{0,150}nameplate:(\i).*?name:null.*?(?=avatar:)/,
                    replace: "$&fpNameplate:$self.customnameplate($1, $2),",
                },
                {
                    match: /(?<=\),nameplate:)(\i)/,
                    replace: "$self.nameplate($1)"
                }
            ]
        },
        {
            find: "role:\"listitem\",innerRef",
            predicate: () => settings.store.preferNameplate,
            replacement: {
                // Orginal note(not mine): We cant access the user id here, so we take the banner property we set earlier
                match: /children:\[(?=.{0,100}\.MEMBER_LIST)/,
                replace: "$&arguments[0].fpNameplate,"
            }
        }
    ],

    // Avatar
    getAvatarHook: (original: any) => (user: User, animated: boolean, size: number) => {
        if (settings.store.nitroFirst) return original(user, animated, size);
        if (settings.store.nitroFirst && user.avatar?.startsWith("a_")) return original(user, animated, size);

        const userData = usersStore.getState().get(user.id);
        if (animated) {
            return userData?.avatar ?? original(user, animated, size);
        } else {
            const avatarUrl = userData?.avatar;
            if (avatarUrl && typeof avatarUrl === "string") {
                const parsedUrl = new URL(avatarUrl);
                return parsedUrl;
            }
            return original(user, animated, size);
        }
    },

    // Banner
    getVoiceBackgroundStyles({ className, participantUserId }: any) {
        if (className.includes("tile")) {
            const userData = usersStore.getState().get(participantUserId);
            if (userData && userData.banner) {
                return {
                    backgroundImage: `url(${userData.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                };
            }
        }
    },

    patchBannerUrl({ displayProfile }: any) {
        if (displayProfile?.banner && settings.store.nitroFirst) return;

        const userData = usersStore.getState().get(displayProfile?.userId);
        if (userData && userData.banner && settings.store.showBanner === true) return userData.banner;
    },

    // Nameplate
    nameplate(nameplate: Nameplate | undefined) {
        return nameplate;
    },

    customnameplate(user: User, nameplate: Nameplate | undefined) {
        const userId = user?.id;

        const userData = usersStore.getState().get(userId);
        if (userData && userData?.nameplate && settings.store.preferNameplate) {
            const url = userData.nameplate;
            const urlStr = url.src;
            return (<img id={`custom-nameplate-${user.id}`} src={urlStr} className="custom-nameplate" />);
        }
        return null;
    },

    // Others thing
    userExists(userId: string) {
        const userData = usersStore.getState().get(userId);
        return !!userData;
    },
});
