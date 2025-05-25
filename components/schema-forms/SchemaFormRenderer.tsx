"use client";
import ArticleForm from "./ArticleForm";
import ProductForm from "./ProductForm";
import LocalBusinessForm from "./LocalBusinessForm";
import BreadcrumbForm from "./Breadcrumb";
import EventForm from "./EventForm";
import JobPostingForm from "./JobPostingForm";
import FAQPageForm from "./FAQPageForm";
import OrganizationForm from "./OrganizationForm";
import PersonForm from "./PersonForm";
import VideoForm from "./VideoForm";
import WebsiteForm from "./WebsiteForm";

type Props = {
  schemaType: string | null;
};

export default function SchemaFormRenderer({ schemaType }: Props) {
  switch (schemaType) {
    case "Article":
      return <ArticleForm />;
    case "Breadcrumb":
      return <BreadcrumbForm />;
    case "Event":
      return <EventForm />;
    case "FAQ Page":
      return <FAQPageForm />;
    case "Job Posting":
      return <JobPostingForm />;
    case "Local Business":
      return <LocalBusinessForm />;
    case "Organization":
      return <OrganizationForm />;
    case "Person":
      return <PersonForm />;
    case "Product":
      return <ProductForm />;
    case "Video":
      return <VideoForm />;
    case "Website":
      return <WebsiteForm />;
    default:
      return null;
  }
}
