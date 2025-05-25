"use client"
import { useState } from 'react';
import {
  AppShell, Container,
  Paper, 
  Title, 
  
  Stack,
  
   Input, InputBase, Combobox, useCombobox,
  
 
} from '@mantine/core';
import '@mantine/core/styles.css';
import { Header } from '@/components/header';
import SchemaFormRenderer from "@/components/schema-forms/SchemaFormRenderer";

// Tải map chỉ ở client

const groceries = ['Article', 'Breadcrumb', 'Event', 'FAQ Page','Job Posting','Local Business','Organization','Person','Product','Video','Website'];

export default function Home() {

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));



  return (
    <div>
      <Header/>
    <AppShell  styles={{ main: { padding: 0, height: '100vh', backgroundColor:'var(--mantine-backgourdtool)' } }} mt="xl">
      <Container >
        <Stack >
           <Title order={2}>Schema markup generator</Title>
        
          <Stack gap="lg">
      <Paper shadow="xs" p="md" withBorder className='bg-custom-box'>
        <Stack gap="md" >
          <Title order={4}>Which Schema would you like to create?
</Title>
          
         <Combobox
  store={combobox}
  onOptionSubmit={(val) => {
    setValue(val);
    combobox.closeDropdown();
  }}
>
  <Combobox.Target>
    <InputBase
      component="button"
      type="button"
      pointer
      rightSection={<Combobox.Chevron />}
      rightSectionPointerEvents="none"
      onClick={() => combobox.toggleDropdown()}
    >
      {value || <Input.Placeholder>Pick value</Input.Placeholder>}
    </InputBase>
  </Combobox.Target>

  <Combobox.Dropdown>
    <Combobox.Options>{options}</Combobox.Options>
  </Combobox.Dropdown>
</Combobox>



          
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder className='bg-custom-box'>
        <SchemaFormRenderer schemaType={value} />
      </Paper>
    </Stack>
          
         

  
        
        </Stack>

      </Container>
    </AppShell>
    </div>
  );
  
}
