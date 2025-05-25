"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Grid,
  Tooltip,
  Transition,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";

export default function LocalBusinessForm() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressLocality, setAddressLocality] = useState("");
  const [addressRegion, setAddressRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [url, setUrl] = useState("");
  const [jsonLD, setJsonLD] = useState("");

  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name,
      image,
      telephone,
      email,
      address: {
        "@type": "PostalAddress",
        streetAddress: addressStreet,
        addressLocality: addressLocality,
        addressRegion: addressRegion,
        postalCode: postalCode,
        addressCountry: addressCountry,
      },
      priceRange,
      url,
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    name,
    image,
    telephone,
    email,
    addressStreet,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry,
    priceRange,
    url,
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
      <Title order={4}>Local Business Schema</Title>

      <TextInput
        label="Tên Doanh nghiệp"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="Hình ảnh (URL)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Số điện thoại"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Đường (Street Address)"
        value={addressStreet}
        onChange={(e) => setAddressStreet(e.target.value)}
      />
      <TextInput
        label="Thành phố (Locality)"
        value={addressLocality}
        onChange={(e) => setAddressLocality(e.target.value)}
      />
      <TextInput
        label="Tỉnh/Bang (Region)"
        value={addressRegion}
        onChange={(e) => setAddressRegion(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Mã bưu điện"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Quốc gia"
            value={addressCountry}
            onChange={(e) => setAddressCountry(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Khoảng giá (ví dụ: $$$)"
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
      />
      <TextInput
        label="Website (URL)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
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
