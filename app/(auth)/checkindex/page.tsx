'use client';
import { translations } from "@/lib/i18n";
import { useEffect, useState } from 'react';
import { useLocale } from "@/hooks/useLocale"
import '@mantine/core/styles.css';
import {
  Button, Container, Textarea, Title, Table, Grid, Text, Image, Badge,
   Card, Group, Notification, Pagination, Select,Box,Breadcrumbs,Anchor
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import './checkindex.css';
import { checkIndex } from '../../api/checkindex/checkindex';
import { IconDownload } from '@tabler/icons-react';
import { Header } from "@/components/header"
import * as XLSX from 'xlsx';

interface ResultItem {
  url: string;
  indexed: string;
  checkTime: string;
  timestamp: string;
}

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const normalizeInput = (input: string) => {
  return input
    .replace(/\r/g, '')
    .replace(/\u200B/g, '')
    .replace(/\t/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

const IndexPage = () => {
  const [urls, setUrls] = useState('');
  const { locale } = useLocale();
  const [results, setResults] = useState<ResultItem[]>([]);
  const [urlList, setUrlList] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // Added loading state

  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const pageSize = 10;

  // Filter state for Indexed column
  const [indexedFilter, setIndexedFilter] = useState<'all' | 'index' | 'noindex'>('all');

  // Mode state for combobox
  const [mode, setMode] = useState<'"URL"' | 'Site:URL'>('"URL"');

  const debouncedUrls = useDebounce(urls, 400); // debounce 400ms

  useEffect(() => {
    const lines = normalizeInput(debouncedUrls);
    setUrlList(lines);

    if (lines.length === 0) {
      setError('');
      setDisabled(true);
      return;
    }

    if (lines.length > 400) {
      setError(translations[locale].messages.checkindexError);
      setDisabled(true);
      return;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const protocolMatches = line.match(/https?:\/\//g);
      const count = protocolMatches ? protocolMatches.length : 0;

      if (count !== 1) {
        setError(`${translations[locale].texts.line} ${i + 1} ${translations[locale].messages.checkindexErrorText}`);
        setDisabled(true);
        return;
      }

      const urlMatch = line.match(/https?:\/\/\S+/);
      if (!urlMatch || !isValidUrl(urlMatch[0])) {
        setError(`${translations[locale].texts.line} ${i + 1} ${translations[locale].messages.checkindexErrorTexts}`);
        setDisabled(true);
        return;
      }
    }

    setError('');
    setDisabled(false);
  }, [debouncedUrls]);

  const handleCheckIndex = async () => {
    setLoading(true); // Set loading true when request starts
    setSuccessMessage('');
    const urlString = urlList.join('\n');
   
    const dataCheck = {
      data: urlString,
      'mode': mode
    }
    try {
      const datalist = await checkIndex(dataCheck);
      
      if(datalist){
       
        setResults(datalist.results)
        setActivePage(1); // Reset to first page on new results
        setSuccessMessage(translations[locale].messages.checkindexSuccess);
      }else{
        console.log("Error")
      }
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
      
    }
  };

  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = filteredResults.map((item, index) => ({
      '#': index + 1,
      Links: item.url,
      Indexed: item.indexed,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    // Tạo và download
    XLSX.writeFile(workbook, 'index_results.xlsx');
  };


  // Lọc theo trường
  const filteredResults = results.filter((item) => {
    if (indexedFilter === 'all') return true;
    if (indexedFilter === 'index') return item.indexed.toLowerCase() === 'index';
    if (indexedFilter === 'noindex') return item.indexed.toLowerCase() === 'no index';
    return true;
  });

  const items = [
    { title: 'SCAPBOT LIKEPION', href: '#' },
    { title: 'SEO', href: '#' },
    { title: 'CHECK INDEX', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} underline="never" >
      {item.title}
    </Anchor>
  ));
  // Tính số phân trang
  const paginatedResults = filteredResults.slice((activePage - 1) * pageSize, activePage * pageSize);
  const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUrls(text);
      };
      reader.readAsText(file);
    } else {
      alert('Chỉ hỗ trợ file .txt!');
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
  };
  return (
    <div className="pageBackground" >
    <Box style={{ zIndex:1000, position:'fixed', width:'100%'}}><Header /></Box>
    
    
    <Grid  align="center" style={{ overflow: 'visible' }}  >
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={6}>
      <Breadcrumbs separator="»" mt="md" className='breadcrumbs'>
        {items}
      </Breadcrumbs>
        <Container size="xl" py="xl"> 
        <Box className='Boxtitle'>
          <Group justify="center" gap="xl" >
            <Title order={1}>GOOGLE INDEX CHECKER</Title>
            <Title order={4}>{translations[locale].titles.checkindex}</Title>
          </Group>
          </Box>
        <Box className='Box'>
        
          <Group justify="center" gap="xl" mt="md">
            <Title order={3}>{translations[locale].titles.checkindexLink}</Title>
          </Group>

          <Textarea
            mt="xl"
            placeholder="https://example.com"
            autosize
            minRows={10}
            
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            maxRows={10}
            value={urls}
            onChange={(e) => setUrls(e.currentTarget.value)}
          />

          {error && (
            <Notification icon={<IconAlertCircle />} color="red" mt="md" onClose={() => setError('')} withCloseButton>
              {error}
            </Notification>
          )}
          {successMessage && (
            <Notification color="green" mt="md" onClose={() => setSuccessMessage('')} withCloseButton>
              {successMessage}
            </Notification>
          )}

          <Group justify="center" gap="xl" mt="md">
            <Button onClick={handleCheckIndex} color="blue" size="md"  disabled={disabled} loading={loading}>
              Check index
            </Button>
            <Select
              
              placeholder={translations[locale].placeholders.entity_checkindex}
              value={mode}
              onChange={(value) => setMode(value as '"URL"' | 'Site:URL')}
              data={[
                { value: 'soft', label: 'Site:URL' },
                { value: 'strict', label: '"URL"' },
              ]}
              style={{ width: 200 }}
            />
          </Group>
          </Box>
          {results.length > 0 ? (
          <>
          <Group justify="center" gap="xl" mt="md">
            <Title order={3}>Result</Title>
          </Group>

         
          
          <Grid   >
      <Grid.Col span={3}> 
        <Group mt="md" mb="md" style={{ maxWidth: 400, margin: '0 auto' }}>
            <Text fw={700}>Total checked links: {results.length}</Text>
            <Text fw={700}>Indexed links: {results.filter(item => item.indexed.toLowerCase() === 'index').length}</Text>
            <Text fw={700}>No indexed links: {results.filter(item => item.indexed.toLowerCase() === 'no index').length}</Text>
            <Text fw={700}>
              Indexed ratio: {results.length > 0 ? ((results.filter(item => item.indexed.toLowerCase() === 'index').length / results.length) * 100).toFixed(2) : '0'}%
            </Text>
          </Group>
          </Grid.Col>
      <Grid.Col span={5}></Grid.Col>
      <Grid.Col span={4}>
        <Group mb="sm" justify="flex-end" mt="md">
           
             <Button rightSection={<IconDownload size={14} />} color="blue" onClick={exportToExcel}>Export</Button>
             <Select
              label="Filter Indexed"
              value={indexedFilter}
              comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
              onChange={(value) => {
                setIndexedFilter(value as 'all' | 'index' | 'noindex');
                setActivePage(1); // Reset to first page on filter change
              }}
              data={[
                { value: 'all', label: 'All' },
                { value: 'index', label: 'Index' },
                { value: 'noindex', label: 'No index' },
              ]}
            />
          </Group>
          </Grid.Col>
    </Grid>
    
          
        <Table striped highlightOnHover withTableBorder withColumnBorders mt="md" stickyHeader stickyHeaderOffset={60} verticalSpacing="sm" withRowBorders={true}> 
            <Table.Thead>
        <Table.Tr>
          <Table.Th >#</Table.Th>
          <Table.Th>Links</Table.Th>
          <Table.Th>Indexed</Table.Th>
         
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {paginatedResults.map((item, index) => (
    <tr key={index}>
      <Table.Td>{(activePage - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{item.url}</Table.Td>
      <Table.Td>{item.indexed}</Table.Td>
     
    </tr>
  ))}
      </Table.Tbody>
            </Table>
          {results.length > pageSize && (
            <Group align="center" mt="md">
              <Pagination 
                value={activePage} 
                onChange={setActivePage} 
                total={Math.ceil(results.length / pageSize)} 
                siblings={1} 
                boundaries={1} 
                size="md"
              />
            </Group>
          )}
          </>
          ) : null}
          
        </Container>
        
      </Grid.Col>

      <Grid.Col span={4} >
        <Card py="sm" style={{ width: '50%',zIndex: 1, position: 'relative' }} withBorder  > 
          <Card.Section>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Norway Fjord Adventures</Text>
            <Badge color="pink">On Sale</Badge>
          </Group>

          <Text size="sm" c="dimmed">
            With Fjord Tours you can explore more of the magical fjord landscapes with tours and
            activities on and around the fjords of Norway
          </Text>

          <Button color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
      </Grid.Col>
    </Grid>
    </div>
  );
  
};

export default IndexPage;
