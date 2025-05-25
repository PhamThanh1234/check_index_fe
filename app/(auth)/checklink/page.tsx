"use client";
import { useState } from 'react';
import {
  Button,
  Container,
  Textarea,
  Title,
  Table,
  Notification,
  Pagination,
  Select,
  Group,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { checkLink } from '../../api/checkLink/checklink';

import '@mantine/core/styles.css';
import './checkindex.css';
import { Header } from '@/components/header';

interface ResultItem {
  url: string;
  status: number | string;
}

const normalizeInput = (input: string) => {
  return input
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return 'https://' + trimmed;
      }
      return trimmed;
    })
    .filter((line) => line !== null) as string[];
};

const IndexPage = () => {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'error'>('all');
  const pageSize = 10;

  const handleCheckLink = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await checkLink({ urls: normalizeInput(urls) });
      setResults(response.results);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveErrorLinks = () => {
    const errorUrls = results.filter(item => item.status !== 200).map(item => item.url);
    const currentUrls = normalizeInput(urls);
    const filtered = currentUrls.filter(url => !errorUrls.includes(url));
    setUrls(filtered.join('\n'));
    setSuccessMessage('Đã xóa các link lỗi thành công!');
  };

  const filteredResults = results.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'active') return item.status === 200;
    if (filter === 'error') return item.status !== 200;
  });

  const paginatedResults = filteredResults.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

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
    <div>
      <Header />

      <Container mb="xs" mt="xl">
        <Title>Check Url Status</Title>

        <Textarea
          mt="xl"
          minRows={10}
          maxRows={10}
          autosize
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs here"
        />

        <Button onClick={handleCheckLink} loading={loading} mt="sm">
          Check Links
        </Button>

        {results.length > 0 && (
          <Button color="red" mt="sm" ml="sm" onClick={handleRemoveErrorLinks}>
            Xóa link lỗi
          </Button>
        )}

        {error && (
          <Notification color="red" icon={<IconAlertCircle />} mt="sm">
            {error}
          </Notification>
        )}

        {successMessage && (
          <Notification
            color="green"
            mt="sm"
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Notification>
        )}

        <Group mt="md">
          <Select
            value={filter}
            onChange={(value) => setFilter(value as 'all' | 'active' | 'error')}
            data={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </Group>

        <Table mt="md">
          <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedResults.map((item, index) => (
              <tr key={index}>
                <td>{(activePage - 1) * pageSize + index + 1}</td>
                <td>{item.url}</td>
                <td>{item.status === 200 ? 'Active' : `Error ${item.status}`}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filteredResults.length > pageSize && (
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={Math.ceil(filteredResults.length / pageSize)}
          />
        )}
      </Container>
    </div>
  );
};

export default IndexPage;
