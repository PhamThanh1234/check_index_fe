"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Textarea,
  Grid,
  Tooltip,
  Loader,
  Transition,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";
export default function VideoForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [duration, setDuration] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
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
      "@type": "VideoObject",
      name,
      description,
      thumbnailUrl,
      uploadDate,
      duration,
      contentUrl,
      embedUrl,
      publisher: {
        "@type": "Organization",
        name: publisherName,
        logo: {
          "@type": "ImageObject",
          url: publisherLogo,
        },
      },
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
    publisherName,
    publisherLogo,
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
      <Title order={4}>Video Schema</Title>

      <TextInput
        label="Tiêu đề"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        label="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextInput
        label="Thumbnail URL"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Ngày đăng (YYYY-MM-DD)"
            value={uploadDate}
            onChange={(e) => setUploadDate(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Thời lượng (ISO 8601 - ví dụ: PT1M33S)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Content URL"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Embed URL"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Tên nhà xuất bản"
            value={publisherName}
            onChange={(e) => setPublisherName(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Logo nhà xuất bản (URL)"
            value={publisherLogo}
            onChange={(e) => setPublisherLogo(e.target.value)}
          />
        </Grid.Col>
      </Grid>

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
