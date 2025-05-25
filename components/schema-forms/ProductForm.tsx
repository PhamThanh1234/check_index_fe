"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Grid,
  Textarea,
  NumberInput,
  Select,
  Tooltip,
  Transition,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy, IconCheck, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { CodeBlock } from "./CodeBlock";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [mpn, setMpn] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [priceCurrency, setPriceCurrency] = useState("USD");
  const [availability, setAvailability] = useState(
    "https://schema.org/InStock"
  );
  const [url, setUrl] = useState("");
  const [reviews, setReviews] = useState([
    { author: "", reviewBody: "", rating: 5 },
  ]);
  const [jsonLD, setJsonLD] = useState("");

  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    const schema: any = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name,
      image,
      description,
      sku,
      mpn,
      brand: {
        "@type": "Brand",
        name: brand,
      },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency,
        price,
        availability,
      },
    };

    if (reviews.length > 0 && reviews[0].author) {
      schema.review = reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewBody: r.reviewBody,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
        },
      }));
    }

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    name,
    image,
    description,
    brand,
    sku,
    mpn,
    price,
    priceCurrency,
    availability,
    url,
    reviews,
  ]);

  const handleReviewChange = (
    index: number,
    field: keyof (typeof reviews)[0],
    value: string | number
  ) => {
    const updatedReviews = [...reviews];
    updatedReviews[index] = {
      ...updatedReviews[index],
      [field]: value,
    };
    setReviews(updatedReviews);
  };

  const addReview = () => {
    setReviews([...reviews, { author: "", reviewBody: "", rating: 5 }]);
  };

  const removeReview = (index: number) => {
    if (index === 0) return;
    setReviews(reviews.filter((_, i) => i !== index));
  };

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
      <Title order={4}>Product Schema</Title>

      <TextInput
        label="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="Hình ảnh (URL)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Textarea
        label="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="MPN"
            value={mpn}
            onChange={(e) => setMpn(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Tên thương hiệu"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            label="Giá"
            value={price}
            onChange={(val) => setPrice(val)}
            min={0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Đơn vị tiền tệ (ví dụ: USD, VND)"
            value={priceCurrency}
            onChange={(e) => setPriceCurrency(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <Select
            label="Tình trạng"
            value={availability}
            onChange={(val) => setAvailability(val!)}
            data={[
              { label: "In Stock", value: "https://schema.org/InStock" },
              { label: "Out of Stock", value: "https://schema.org/OutOfStock" },
              { label: "Pre Order", value: "https://schema.org/PreOrder" },
              {
                label: "Discontinued",
                value: "https://schema.org/Discontinued",
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="URL sản phẩm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Title order={5} mt="md">
        Đánh giá
      </Title>
      {reviews.map((review, i) => (
        <Stack key={i}>
          <TextInput
            label={`Người đánh giá ${i + 1}`}
            value={review.author}
            onChange={(e) => handleReviewChange(i, "author", e.target.value)}
          />
          <Textarea
            label={`Nội dung đánh giá ${i + 1}`}
            value={review.reviewBody}
            onChange={(e) =>
              handleReviewChange(i, "reviewBody", e.target.value)
            }
          />
          <NumberInput
            label="Điểm đánh giá (1-5)"
            min={1}
            max={5}
            value={review.rating}
            onChange={(val) => handleReviewChange(i, "rating", val)}
          />
          {i !== 0 && (
            <Button
              variant="subtle"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => removeReview(i)}
            >
              Xoá
            </Button>
          )}
        </Stack>
      ))}
      <Button onClick={addReview} variant="outline">
        Thêm đánh giá
      </Button>

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
