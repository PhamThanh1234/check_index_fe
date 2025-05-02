"use client";

import {
  Group,
  Stack,
  Burger,
  Button,
  Drawer,
  Space,
  Flex,
} from "@mantine/core";
import classes from "./Header.module.css";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { translations } from "@/lib/i18n";
import OptimizedImage from "@/components/OptimizedImage/OptimizedImage";



const Header = () => {
   // check theme
    const [opened, { toggle, close }] = useDisclosure(false);
    const {locale} = useLocale();

    const links = [
      { link: "#", label: `${translations[locale].links.features}` },
      { link: "#", label: `${translations[locale].links.pricing}` },
      { link: "#", label: `${translations[locale].links.apiDocs}` },
      { link: "#", label: `${translations[locale].links.community}` },
    ];
    const items = links.map((link) => (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {link.label}
      </a>
    ));
    
  return (
    <header className={` px-4 shadow-sm sticky top-0 bg-custom-box`} >
      <div className={classes.inner}>
        <Flex gap={0} justify={{ base: "space-between", md: "space-between" }} direction={{ base: 'row-reverse', sm: 'row' }} className="max-lg:w-full">
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="md" />
          <Drawer opened={opened} onClose={close} padding="md" size="xs">
            {items}
            <Space h="md" />
            <Stack>
              <Button
                variant="default"
                component={Link}
                href={`/signin`}
                rel="noopener noreferrer"
                onClick={close}
              >
                {translations[locale].auth.signIn}
              </Button>
              <Button
                component={Link}
                href={`/signup`}
                rel="noopener noreferrer"
                onClick={close}
              >
                {translations[locale].auth.signUp}
              </Button>
            </Stack>    
          </Drawer> 
          <Group gap="sm" px="4" align='end'>
            <div className='dark-logo'>
              <OptimizedImage src="/images/dark-logo-likepion.svg" containerClassName="w-[160px] h-[30px]" />
            </div>
            <div className='light-logo'>
              <OptimizedImage src="/images/logo-likepion.svg" containerClassName="w-[160px] h-[30px]" />
            </div>
          </Group>
        </Flex>
        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
          {items}
        </Group>
        <Group visibleFrom="md">
          <Button
            visibleFrom="md"
            variant="default"
            component={Link}
            href={`/signin`}
          >
            {translations[locale].auth.signIn}
          </Button>
          <Button
            visibleFrom="md"
            component={Link}
            href={`/signup`}
          >
            {translations[locale].auth.signUp}
          </Button>
        </Group>
      </div>
    </header>
  )
}

export default Header