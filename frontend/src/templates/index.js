/**
 * Template Registry
 * =================
 * This is the SINGLE place where all templates are registered.
 * 
 * To add a new template:
 * 1. Create a new file in src/templates/ (e.g. CreativeTemplate.jsx)
 * 2. Import it below
 * 3. Add it to the TEMPLATES object with the slug as key
 * 
 * That's it! LivePreview.jsx will automatically pick it up.
 */

import MinimalTemplate from "./MinimalTemplate";
import ModernTemplate from "./ModernTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import FresherTemplate from "./FresherTemplate";

// slug → Component mapping
const TEMPLATES = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    fresher: FresherTemplate,
    // creative: CreativeTemplate,     ← just add new templates here
};

// Default template if slug doesn't match
export const DEFAULT_TEMPLATE = "minimal";

/**
 * Get a template component by slug.
 * Falls back to MinimalTemplate if not found.
 */
export function getTemplate(id, slug) {
    if (!slug) return TEMPLATES[DEFAULT_TEMPLATE];
    console.log("FUCK", slug)
    return TEMPLATES[slug] || TEMPLATES[DEFAULT_TEMPLATE];
}

export default TEMPLATES;
