'use client';

import { useLocale } from "@/hooks/useLocale";
import { translations } from "@/lib/i18n";
import { Header } from "@/components/header"
import { useState, useEffect, useRef } from 'react';
import {
  Container,
  TextInput,
  Button,
  Title,
  Text,
  Grid,
  Box,
  
} from '@mantine/core';
import '@mantine/core/styles.css';
import axios from 'axios';

const Check2Fa = () => {
  const [secret, setSecret] = useState('');
  const { locale } = useLocale();
  const [token, setToken] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  const generateOtp = async (isAuto = false) => {
    if (!secret) return;
    if (!isAuto) {
      setError(null);
      setLoading(true);
    }

    try {
      const response = await axios.post('http://localhost:8888/generate-otp', { secret });

      const expireTime = new Date(response.data.expireAt).getTime();
      const now = Date.now();
      const diff = Math.floor((expireTime - now) / 1000);

      setToken(response.data.token);
      
      setRemaining(diff > 0 ? diff : 0);
    } catch (err: any) {
      if (!isAuto) {
        setError(err.response?.data?.error || 'Server error');
      }
    } finally {
      if (!isAuto) {
        setLoading(false);
      }
    }
  };

  // Đếm ngược thời gian
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (remaining === null || remaining <= 0) return;

    countdownRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current!);
  }, [remaining]);

  // Tự động gọi lại OTP khi timeout = 0
  useEffect(() => {
    if (autoRefreshRef.current) clearTimeout(autoRefreshRef.current);

    if (remaining === 0) {
      autoRefreshRef.current = setTimeout(() => {
        generateOtp(true);
      }, 1000);
    }

    return () => clearTimeout(autoRefreshRef.current!);
  }, [remaining]);

  return (
    <div>
    <Header />
    <Container size="sm" py="xl">
      <Title mb="md">{translations[locale].titles.twofa}</Title>

      <TextInput
        label={translations[locale].lables.twofa}
        placeholder={translations[locale].placeholders.twofa}
        value={secret}
        onChange={(event) => setSecret(event.currentTarget.value)}
        withAsterisk
        mb="md"
      />

      <Button fullWidth onClick={() => generateOtp()} loading={loading} disabled={!secret}>
        {translations[locale].buttons.twofa}
      </Button>

      <Box mt="lg">
        <Grid>
          <Grid.Col span={6}>
            <Text size="xl">
              {translations[locale].texts.twofatext}{' '}
              <b style={{ fontSize: '24px' }}>{token}</b>
            </Text>
          </Grid.Col>

          <Grid.Col span={6}>
            {remaining !== null && (
              <Text size="xl" c={remaining > 10 ? 'blue' : 'red'}>
                {`Timeout: ${remaining}s`}
              </Text>
            )}
          </Grid.Col>
        </Grid>

        {error && <Text color="red">{error}</Text>}
      </Box>
    </Container>
    </div>
  );
  
};

export default Check2Fa;
