import React from "react";
import { getTemplate } from "../../templates";

const LivePreview = ({ data, templateId, templateSlug }) => {

    if (!data) return null;
    console.log("HERE IT IS", templateSlug)
    const TemplateComponent = getTemplate(templateId, templateSlug);

    return <TemplateComponent data={data} />;
};

export default LivePreview;
