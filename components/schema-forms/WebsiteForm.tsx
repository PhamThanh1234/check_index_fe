"use client";

import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Textarea,
  Tooltip,
  Transition,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { CodeBlock } from "./CodeBlock";

export default function WebsiteForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [potentialActionUrlTemplate, setPotentialActionUrlTemplate] =
    useState("");
  const [description, setDescription] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [publisherLogo, setPublisherLogo] = useState("");

  const [jsonLD, setJsonLD] = useState("");

  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name,
      url,
      description,
      publisher: {
        "@type": "Organization",
        name: publisherName,
        logo: {
          "@type": "ImageObject",
          url: publisherLogo,
        },
      },
      potentialAction: potentialActionUrlTemplate
        ? {
            "@type": "SearchAction",
            target: potentialActionUrlTemplate,
            "query-input": "required name=search_term_string",
          }
        : undefined,
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    name,
    url,
    description,
    publisherName,
    publisherLogo,
    potentialActionUrlTemplate,
  ]);

  const handleCopy = async () => {
    setCopyingJson(true);
    try {
      await navigator.clipboard.writeText(jsonLD);
      setCopiedJson(true);
      notifications.show({
        title: "Copied!",
        message: "JSON-LD copied to clipboard.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to copy.",
        color: "red",
      });
    } finally {
      setCopyingJson(false);
      setTimeout(() => setCopiedJson(false), 1500);
    }
  };

  const handleCopyScript = async () => {
    setCopyingHtml(true);
    try {
      const htmlScript = `<script type="application/ld+json">\n${jsonLD}\n</script>`;
      await navigator.clipboard.writeText(htmlScript);
      setCopiedHtml(true);
      notifications.show({
        title: "Copied!",
        message: "HTML Embed copied to clipboard.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to copy HTML.",
        color: "red",
      });
    } finally {
      setCopyingHtml(false);
      setTimeout(() => setCopiedHtml(false), 1500);
    }
  };

  return (
    <Stack>
      <Title order={4}>Website Schema</Title>

      <TextInput
        label="Tên Website"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="URL Website"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Textarea
        label="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextInput
        label="Tên Nhà Xuất Bản"
        value={publisherName}
        onChange={(e) => setPublisherName(e.target.value)}
      />
      <TextInput
        label="Logo Nhà Xuất Bản (URL)"
        value={publisherLogo}
        onChange={(e) => setPublisherLogo(e.target.value)}
      />
      <TextInput
        label="Search Action Target (ví dụ: https://example.com/search?q={search_term_string})"
        value={potentialActionUrlTemplate}
        onChange={(e) => setPotentialActionUrlTemplate(e.target.value)}
      />

      <Group justify="space-between" mt="md">
        <Title order={5}>JSON-LD Preview</Title>
        <Tooltip label={copiedJson ? "Copied!" : "Copy JSON"} withArrow>
          <Button
            size="xs"
            variant="light"
            onClick={handleCopy}
            leftSection={
              copyingJson ? (
                <Loader size="xs" />
              ) : copiedJson ? (
                <Transition
                  mounted
                  transition="pop"
                  duration={200}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <IconCheck size={16} style={styles} color="teal" />
                  )}
                </Transition>
              ) : (
                <IconCopy size={16} />
              )
            }
          >
            {copiedJson ? "Copied" : "Copy JSON"}
          </Button>
        </Tooltip>
      </Group>

      <CodeBlock code={jsonLD} language="json" />

      <Group justify="space-between" mt="md">
        <Title order={5}>HTML Embed (for SEO testing)</Title>
        <Tooltip label={copiedHtml ? "Copied!" : "Copy HTML"} withArrow>
          <Button
            size="xs"
            variant="light"
            onClick={handleCopyScript}
            leftSection={
              copyingHtml ? (
                <Loader size="xs" />
              ) : copiedHtml ? (
                <Transition
                  mounted
                  transition="pop"
                  duration={200}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <IconCheck size={16} style={styles} color="teal" />
                  )}
                </Transition>
              ) : (
                <IconCopy size={16} />
              )
            }
          >
            {copiedHtml ? "Copied" : "Copy HTML"}
          </Button>
        </Tooltip>
      </Group>

      <CodeBlock
        code={`<script type="application/ld+json">\n${jsonLD}\n</script>`}
        language="html"
      />
    </Stack>
  );
}
