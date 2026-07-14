import {
  IconEyeglass,
  IconBox,
  IconCircleDot,
  IconSun,
  IconEye,
  IconBriefcase,
  IconSparkles,
  IconFlame,
  IconCrown,
  IconTag,
} from "@tabler/icons-react";

// Maps the icon name STORED ON THE CATEGORY DOCUMENT (see
// scripts/seedCategories.js) to the actual icon component. Only imports
// the handful of icons this app actually uses, instead of the whole
// @tabler/icons-react library (which is thousands of icons).
export const CATEGORY_ICON_MAP = {
  IconEyeglass,
  IconBox,
  IconCircleDot,
  IconSun,
  IconEye,
  IconBriefcase,
  IconSparkles,
  IconFlame,
  IconCrown,
  IconTag,
};

export function getCategoryIcon(iconName) {
  return CATEGORY_ICON_MAP[iconName] || IconTag;
}
