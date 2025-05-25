"use client"

import { Paper, Text, Center, Box } from "@mantine/core"
import Link from "next/link"
import {
  IconFileText,
  IconFileCheck,
  IconAbc,
  IconCalculator,
  IconHash,
  IconLetterCase,
  IconArrowsJoin,
  IconPhoto,
  IconPhotoUp,
  IconMicrophone,
  IconFileTypography,
  IconLetterT,
  IconFileDescription,
  IconArrowBackUp,
  IconMicrophoneOff,
  IconReplace,
  IconRobot,
  IconFile,
  IconCheck,
  IconRefresh,
  IconBraces,
  IconFileAnalytics,
  IconPencil,
  IconEdit,
  IconWriting,
  IconFileSearch,
  IconLiveView,
  IconAuth2fa
} from "@tabler/icons-react"

interface ToolCardProps {
  id: string
  title: string
  icon: string
  href: string
}

export function ToolCard({ title, icon, href }: ToolCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "plagiarism":
        return <IconFileCheck size={32} color="var(--mantine-primary-color-filled)" />
      case "rewriter":
        return <IconAuth2fa size={32} color="var(--mantine-primary-color-filled)" />
      case "grammar":
        return <IconFileText size={32} color="var(--mantine-primary-color-filled)" />
      case "word":
        return <IconCalculator size={32} color="var(--mantine-primary-color-filled)" />
      case "spell":
        return <IconCheck size={32} color="var(--mantine-primary-color-filled)" />
      case "paraphrase":
        return <IconReplace size={32} color="var(--mantine-primary-color-filled)" />
      case "md5":
        return <IconHash size={32} color="var(--mantine-primary-color-filled)" />
      case "case":
        return <IconLetterCase size={32} color="var(--mantine-primary-color-filled)" />
      case "combiner":
        return <IconArrowsJoin size={32} color="var(--mantine-primary-color-filled)" />
      case "img2text":
        return <IconPhoto size={32} color="var(--mantine-primary-color-filled)" />
      case "geotagimg":
        return <IconLiveView size={32} color="var(--mantine-primary-color-filled)" />
      case "text2img":
        return <IconPhotoUp size={32} color="var(--mantine-primary-color-filled)" />
      case "text2speech":
        return <IconMicrophone size={32} color="var(--mantine-primary-color-filled)" />
      case "jpg2word":
        return <IconFileTypography size={32} color="var(--mantine-primary-color-filled)" />
      case "smalltext":
        return <IconLetterT size={32} color="var(--mantine-primary-color-filled)" />
      case "editor":
        return <IconFileDescription size={32} color="var(--mantine-primary-color-filled)" />
      case "reverse":
        return <IconArrowBackUp size={32} color="var(--mantine-primary-color-filled)" />
      case "speech2text":
        return <IconMicrophoneOff size={32} color="var(--mantine-primary-color-filled)" />
      case "rephraser":
        return <IconReplace size={32} color="var(--mantine-primary-color-filled)" />
      case "ai":
        return <IconRobot size={32} color="var(--mantine-primary-color-filled)" />
      case "paragraph":
        return <IconFileText size={32} color="var(--mantine-primary-color-filled)" />
      case "sentence":
        return <IconAbc size={32} color="var(--mantine-primary-color-filled)" />
      case "reword":
        return <IconRefresh size={32} color="var(--mantine-primary-color-filled)" />
      case "punctuation":
        return <IconBraces size={32} color="var(--mantine-primary-color-filled)" />
      case "essay":
        return <IconFileAnalytics size={32} color="var(--mantine-primary-color-filled)" />
      case "paper":
        return <IconFileSearch size={32} color="var(--mantine-primary-color-filled)" />
      case "proofread":
        return <IconEdit size={32} color="var(--mantine-primary-color-filled)" />
      case "wordchange":
        return <IconWriting size={32} color="var(--mantine-primary-color-filled)" />
      case "sentencerewrite":
        return <IconPencil size={32} color="var(--mantine-primary-color-filled)" />
      case "essayrewrite":
        return <IconFileDescription size={32} color="var(--mantine-primary-color-filled)" />
      default:
        return <IconFile size={32} color="var(--mantine-primary-color-filled)" />
    }
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Paper
        p="md"
        radius="md"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        withBorder
        className="bg-custom-box"
      >
        <Center mb={10}>
          <Box w={40} h={40} >
            {getIcon()}
          </Box>
        </Center>
        <Text size="sm" fw={500}>
          {title}
        </Text>
      </Paper>
    </Link>
  )
}
