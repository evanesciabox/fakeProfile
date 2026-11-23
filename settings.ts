import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    nitroFirst: {
        description: "Things to use if both Nitro and fakeProfile features are present",
        type: OptionType.SELECT,
        options: [
            { label: "Nitro", value: true, default: true },
            { label: "fakeProfile", value: false },
        ]
    },
    showAvatar: {
        description: "Showing fakeProfile's avatar (requires in Nitro First set option \"fakeProfile\")",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    showBanner: {
        description: "Showing fakeProfile's banner (requires in Nitro First set option \"fakeProfile\")",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    voiceBackground: {
        description: "Use fakeProfile banners as voice chat backgrounds",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    preferNameplate: {
        description: "Displays fakeProfile's nameplates picture which are present (remove Discord's nameplate before use this, or it will looks weird in member list)",
        type: OptionType.BOOLEAN,
        default: false
    },
    enableCustomBadges: {
        description: "Displays fakeProfile's custom badges",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    }
});
