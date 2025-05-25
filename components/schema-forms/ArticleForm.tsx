"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Textarea,
  Group,
  Grid,
  Transition,
  Loader,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";
export default function ArticleForm() {
  const [headline, setHeadline] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [publisherLogo, setPublisherLogo] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [dateModified, setDateModified] = useState("");
  const [articleSection, setArticleSection] = useState("");
  const [articleBody, setArticleBody] = useState("");
  const [url, setUrl] = useState("");
  const [mainEntityOfPage, setMainEntityOfPage] = useState("");
  const [jsonLD, setJsonLD] = useState("");
  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      image,
      author: {
        "@type": "Person",
        name: author,
      },
      publisher: {
        "@type": "Organization",
        name: publisherName,
        logo: {
          "@type": "ImageObject",
          url: publisherLogo,
        },
      },
      datePublished,
      dateModified,
      articleSection,
      articleBody,
      url,
      mainEntityOfPage,
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    headline,
    image,
    author,
    publisherName,
    publisherLogo,
    datePublished,
    dateModified,
    articleSection,
    articleBody,
    url,
    mainEntityOfPage,
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
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Tiêu đề"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="URL Hình ảnh"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Tên Nhà xuất bản"
            value={publisherName}
            onChange={(e) => setPublisherName(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Tác giả"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Logo Nhà xuất bản (URL)"
        value={publisherLogo}
        onChange={(e) => setPublisherLogo(e.target.value)}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Ngày xuất bản (YYYY-MM-DD)"
            value={datePublished}
            onChange={(e) => setDatePublished(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Ngày chỉnh sửa (YYYY-MM-DD)"
            value={dateModified}
            onChange={(e) => setDateModified(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Chuyên mục"
        value={articleSection}
        onChange={(e) => setArticleSection(e.target.value)}
      />
      <Textarea
        label="Nội dung bài viết"
        value={articleBody}
        onChange={(e) => setArticleBody(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="URL Bài viết"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Main Entity Of Page"
            value={mainEntityOfPage}
            onChange={(e) => setMainEntityOfPage(e.target.value)}
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
