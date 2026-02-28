import Template from "../models/Template.js";

const seedTemplates = async () => {
    try {
        const count = await Template.countDocuments();
        // Already seeded

        const templates = [
            {
                name: "Minimal",
                slug: "minimal",
                description: "Clean, minimal design with focus on content. Perfect for developers and writers.",
                previewImage: "/templates/minimal.png",
            },
            {
                name: "Modern",
                slug: "modern",
                description: "Bold and modern layout with gradient accents. Great for designers and creatives.",
                previewImage: "/templates/modern.png",
            },
            {
                name: "Professional",
                slug: "professional",
                description: "Classic professional template ideal for corporate and business roles.",
                previewImage: "/templates/professional.png",
            },
            {
                name: "Fresher",
                slug: "fresher",
                description: "Dark theme with modern gradients and skill bars. Perfect for freshers and new graduates.",
                previewImage: "/templates/fresher.png",
            },
        ];

        if (count > 0 || count == templates.length) return;

        await Template.insertMany(templates);
        console.log("✅ Templates seeded successfully");
    } catch (error) {
        console.error("❌ Template seeding error:", error);
    }
};

export default seedTemplates;
