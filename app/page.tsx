"use client"

import { Container, Grid, Text, Title, Paper, Group, Input, Box, Divider } from "@mantine/core"
import { IconSearch, IconCrown } from "@tabler/icons-react"
import { ToolCard } from "@/components/tool-card"
import { PopularToolsList } from "@/components/popular-tools-list"
import { Header } from "@/components/header"
import { textAnalysisTools, conversionTools, writingTools } from "@/data/tools"

const HomePage = () => {
  return (
    <div>
      <Header />

      <Container size="xl" py="xl">
        <Group gap="xl" align="flex-start">
          {/* Main Content */}
          <Box style={{ flex: 1 }}>
            <Box mb={40} ta="center">
              <Title order={1} size="h1" mb="xs">
                Scapbot SEO Tools
              </Title>

              <Box mb={40}>
                <Title order={2} size="h3" mb="md" fw={600}>
                  Website Tracking Tools
                </Title>
                <Text size="md" c="dimmed" mb="xl" maw={800} mx="auto">
                  A list of free tools in one place to measure, monitor, and keep track of your website’s performance. No need to install any extensions, feel free to use.
                </Text>

                <Grid>
                  {textAnalysisTools.map((tool) => (
                    <Grid.Col span={{ base: 6, sm: 4, md: 3, lg: 2.4 }} key={tool.id}>
                      <ToolCard {...tool} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>

              <Box mb={40}>
                <Title order={2} size="h3" mb="md" fw={600}>
                  Images Editing Tools
                </Title>
                <Text size="md" c="dimmed" mb="xl" maw={800} mx="auto">
                  Create a favicon, compress an image or resize a picture with a single click. All essentials for image editing are available in one place.
                </Text>
                <Grid >
                  {conversionTools.map((tool) => (
                    <Grid.Col  span={{ base: 6, sm: 4, md: 3, lg: 2.4}} key={tool.id} >
                      <ToolCard {...tool}  />
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>

              <Box mb={40}>
                <Title order={2} size="h3" mb="md" fw={600}>
                  Writing & Checking Tools
                </Title>
                <Grid>
                  {writingTools.map((tool) => (
                    <Grid.Col span={{ base: 6, sm: 4, md: 3, lg: 2.4 }} key={tool.id}>
                      <ToolCard {...tool} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box w={{ base: "100%", md: 300 }} >
            <Paper p="md" radius="md" withBorder mb="md" className="bg-custom-box">
              <Group justify="space-between" mb="md">
                <Group>
                  <IconCrown size={20} color="var(--mantine-primary-color-filled)" />
                  <Text fw={600} size="lg">
                    Pricing
                  </Text>
                </Group>
                <IconSearch size={20} />
              </Group>

              <Input placeholder="Search With ScapbotSEOTools" rightSection={<IconSearch size={16} />} mb="md" />

              <Paper p="md" bg="var(--mantine-color-body:)" radius="md" mb="md">
                <Group>
                  <Box
                    w={32}
                    h={32}
                    bg="#e5ecf3"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}
                  >
                    <IconCrown size={18} color="var(--mantine-primary-color-filled)" />
                  </Box>
                  <Text fw={500}>Advertise With Us</Text>
                </Group>
              </Paper>

              <Divider my="md" />

              <Text fw={600} size="lg" mb="md">
                Popular Tools
              </Text>
              <PopularToolsList />
            </Paper>
          </Box>
        </Group>
      </Container>
    </div>
  )
}
export default HomePage;
