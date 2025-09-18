import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { testUserAPI, testAuth } from '../utils/testApi';

interface TestResult {
    name: string;
    status: 'pending' | 'running' | 'success' | 'error';
    message?: string;
    data?: any;
}

const APITestPanel: React.FC = () => {
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTest = async (testName: string, testFunction: () => Promise<any>) => {
        setTestResults(prev => [...prev, { name: testName, status: 'running' }]);

        try {
            const result = await testFunction();
            setTestResults(prev =>
                prev.map(t =>
                    t.name === testName
                        ? { ...t, status: 'success', message: 'Test passed', data: result }
                        : t
                )
            );
        } catch (error: any) {
            setTestResults(prev =>
                prev.map(t =>
                    t.name === testName
                        ? { ...t, status: 'error', message: error.message }
                        : t
                )
            );
        }
    };

    const runAllAPITests = async () => {
        setIsRunning(true);
        setTestResults([]);

        // Test Auth
        await runTest('Authentication', async () => {
            const authResult = testAuth();
            if (!authResult.hasAccessToken) {
                throw new Error('No access token found. Please login first.');
            }
            return authResult;
        });

        // Test User API
        await runTest('User API', testUserAPI);

        setIsRunning(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'error':
                return <ErrorIcon color="error" />;
            case 'running':
                return <CircularProgress size={20} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'running':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🧪 API Integration Test Panel
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Test API connectivity and functionality. Make sure you're logged in before running tests.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={runAllAPITests}
                        disabled={isRunning}
                    >
                        {isRunning ? 'Running Tests...' : 'Run All Tests'}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setTestResults([])}
                        disabled={isRunning}
                    >
                        Clear Results
                    </Button>
                </Stack>

                {testResults.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Test Results:
                        </Typography>

                        {testResults.map((result, index) => (
                            <Accordion key={index} sx={{ mb: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                        {getStatusIcon(result.status)}
                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                            {result.name}
                                        </Typography>
                                        <Chip
                                            label={result.status}
                                            color={getStatusColor(result.status) as any}
                                            size="small"
                                        />
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {result.message && (
                                        <Alert
                                            severity={result.status === 'success' ? 'success' : 'error'}
                                            sx={{ mb: 1 }}
                                        >
                                            {result.message}
                                        </Alert>
                                    )}

                                    {result.data && (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Response Data:
                                            </Typography>
                                            <Box
                                                component="pre"
                                                sx={{
                                                    backgroundColor: 'grey.100',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    overflow: 'auto',
                                                    maxHeight: 200
                                                }}
                                            >
                                                {JSON.stringify(result.data, null, 2)}
                                            </Box>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                    <strong>Available in Console:</strong>
                    <br />
                    • <code>testAPI.runAllTests()</code> - Run all tests
                    <br />
                    • <code>testAPI.testUserAPI()</code> - Test user APIs only
                    <br />
                    • <code>testAPI.testAuth()</code> - Test authentication status
                </Typography>
            </CardContent>
        </Card>
    );
};

export default APITestPanel;
