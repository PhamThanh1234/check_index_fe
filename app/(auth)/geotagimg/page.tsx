"use client"
import { useState } from 'react';
import {
  AppShell, Container, Button, Center, TextInput, 
  Paper, 
  Title, 
  Grid, 
  Stack,
  Rating,
  Group,
  Text
  
} from '@mantine/core';
import '@mantine/core/styles.css';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { DateInput } from '@mantine/dates';
import { Header } from '@/components/header';
import { IconUpload } from '@tabler/icons-react';
import { uploadImageWithMetadata } from '@/app/api/geotagimage/geotagimage';
// Tải map chỉ ở client
const Map = dynamic(() => import('@/components/GeotagMap'), { ssr: false });


export default function Home() {
   const [date, setDate] = useState<Date | null>(new Date("2025-05-15"));
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [copyright, setCopyright] = useState("");
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState("");
  const [rate, setRate] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
const [processedImages, setProcessedImages] = useState<{ name: string; url: string }[]>([]);

const handleGeotagUpdate = async () => {
  try {
    const newProcessedImages: { name: string; url: string }[] = [];

    for (const file of imageFiles) {
      const blob = await uploadImageWithMetadata(file, {
        latitude,
        longitude,
        title,
        subject,
        keywords,
        copyright,
        author,
        comment: comments,
        rating: rate,
        dateTaken: date?.toISOString(), // chuẩn ISO 8601
      });

      const url = URL.createObjectURL(blob);
      newProcessedImages.push({ name: `geotagged-${file.name}`, url });
    }

    setProcessedImages(newProcessedImages);
    alert('Geotag và metadata đã được áp dụng thành công!');
  } catch (error) {
    console.error(error);
    alert('Thất bại khi áp dụng geotag và metadata!');
  }
};

  const updateImageFiles = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateImageFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    updateImageFiles(files);
  };

  return (
    <div>
      <Header/>
    <AppShell  styles={{ main: { padding: 0, height: '100vh', backgroundColor:'var(--mantine-backgourdtool)' } }} mt="xl">
      <Container >
        <Stack >
          
        <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              multiple
            />
            <Paper
              withBorder
              p="xl"
              radius="md"
              style={{ borderStyle: "dashed", borderWidth: "2px", cursor: "pointer" }}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Center>
                {imagePreviews.length > 0 ? (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {imagePreviews.map((src, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={index} src={src} alt="Uploaded Preview" style={{ maxWidth: "150px", maxHeight: "150px" }} />
                    ))}
                  </div>
                ) : (
                  <Group>
                    <IconUpload size={24} />
                    <Text>Click hoặc kéo ảnh vào đây</Text>
                  </Group>
                )}
              </Center>
            </Paper>
          
          <Stack gap="lg">
      <Paper shadow="xs" p="md" withBorder className='bg-custom-box'>
        <Stack gap="md" >
          <Title order={4}>Thông tin chi tiết ảnh</Title>
          
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Latitude (vĩ độ)"
                placeholder="Nhập vĩ độ"
                value={latitude} onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : "")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Longitude (kinh độ)"
                placeholder="Nhập kinh độ"
                 value={longitude} onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : "")}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder className='bg-custom-box'>
        <Stack gap="md">
          <Title order={4}>Thông tin chi tiết ảnh</Title>
          
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Title"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Subject"
                value={subject} onChange={(e) => setSubject(e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Keywords"
                placeholder="..."
                value={keywords} onChange={(e) => setKeywords(e.target.value)}
              />
            </Grid.Col>
              <Grid.Col span={6}>
              <TextInput
                label="Copy Right"
                value={copyright} onChange={(e) => setCopyright(e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Comments"
                value={comments} onChange={(e) => setComments(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Author"
                value={author} onChange={(e) => setAuthor(e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
         
            <Grid.Col span={6}>
              <DateInput
                label="Date Taken"
                placeholder="Select date"
                value={date}
                onChange={setDate}
                clearable={false}
              />
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Text size="sm">Rate</Text>
              <Rating 
                value={rate} onChange={setRate}
               defaultValue={2}
               size="sm" />
            </Grid.Col>
            
          </Grid>
        </Stack>
      </Paper>
    </Stack>
          
         

          <Map
            latitude={latitude ? Number(latitude) : 0}
            longitude={longitude ? Number(longitude) : 0}
            setLatitude={(val) => setLatitude(val)}
            setLongitude={(val) => setLongitude(val)}
          />

          <Center>
            <Button onClick={handleGeotagUpdate}>Apply Geotag & Metadata</Button>
          </Center>
          
        </Stack>
        {processedImages.length > 0 && (
  <Paper shadow="xs" p="md" withBorder mt="lg">
    <Title order={5}>Ảnh đã geotag</Title>
    <Stack mt="sm">
      {processedImages.map((img, index) => (
        <Group key={index} >
          <Text>{img.name}</Text>
          <Button
            component="a"
            href={img.url}
            download={img.name}
            variant="light"
          >
            Tải xuống
          </Button>
        </Group>
      ))}
    </Stack>
  </Paper>
)}
      </Container>
    </AppShell>
    </div>
  );
  
}
