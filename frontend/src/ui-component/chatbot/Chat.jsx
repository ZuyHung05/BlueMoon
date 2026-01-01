import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Avatar, CircularProgress } from '@mui/material';
import { useTheme, useColorScheme } from '@mui/material/styles';
import { Send, User, Plus, Smile, X } from 'lucide-react';

// Import bot avatar image
import BotAvatarImg from 'assets/images/bot_avatar.png';

export default function Bot({ toggled, onClose }) {
    const theme = useTheme();
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = mode === 'dark' || (mode === 'system' && systemMode === 'dark');

    const [messages, setMessages] = useState([{ id: 1, role: 'bot', content: 'Xin chào! Tôi có thể hỗ trợ gì cho bạn?' }]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (toggled) {
            inputRef.current?.focus();
        }
    }, [toggled]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { id: Date.now(), role: 'user', content: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        const botMessageId = Date.now() + 1;
        setMessages((prev) => [...prev, {
            id: botMessageId,
            role: 'bot',
            content: 'Đang xử lý...',
            isStreaming: true,
            isLoading: true
        }]);

        try {
            // Sử dụng endpoint /stream để hiển thị SQL sớm
            const response = await fetch('http://localhost:8001/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Không thể kết nối đến server');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Giữ lại phần chưa hoàn thành vào buffer
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);

                        setMessages((prev) => prev.map((msg) => {
                            if (msg.id !== botMessageId) return msg;

                            const newMsg = { ...msg };
                            if (data.type === 'sql') {
                                newMsg.sql = data.content;
                                // Khi có SQL, chúng ta có thể dừng spinner hoặc giữ lại tùy ý
                                // Ở đây tôi giữ lại spinner cho đến khi có kết quả cuối cùng
                                newMsg.isLoading = true;
                            } else if (data.type === 'answer') {
                                newMsg.answer = data.content;
                                newMsg.content = data.content;
                                newMsg.rawResult = data.raw;
                                newMsg.isLoading = false; // Có kết quả rồi, tắt spinner
                                newMsg.isStreaming = false;
                            } else if (data.type === 'error') {
                                newMsg.content = `⚠️ Lỗi: ${data.content}`;
                                newMsg.isLoading = false;
                                newMsg.isStreaming = false;
                            }
                            return newMsg;
                        }));
                    } catch (e) {
                        console.error('Error parsing stream line:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === botMessageId ? {
                        ...msg,
                        content: `⚠️ Lỗi: ${error.message}`,
                        isLoading: false,
                        isStreaming: false
                    } : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!toggled) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 80,
                right: 24,
                width: 400,
                height: 550,
                zIndex: 1300,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                borderRadius: '16px',
                bgcolor: isDarkMode ? '#0b0f19' : 'background.paper',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'divider'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                }}
            >
                <Avatar
                    src={BotAvatarImg}
                    alt="Bot"
                    sx={{
                        width: 38,
                        height: 38,
                        border: '2px solid',
                        borderColor: 'rgba(255,255,255,0.3)'
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                            lineHeight: 1.2,
                            color: isDarkMode ? '#00334e' : 'inherit'
                        }}
                    >
                        Trợ lý ảo BlueMoon
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            opacity: 0.9,
                            color: isDarkMode ? '#004e5a' : 'inherit'
                        }}
                    >
                        Trực tuyến
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: isDarkMode ? '#00334e' : 'primary.contrastText',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <X size={20} />
                </IconButton>
            </Box>

            {/* Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: isDarkMode ? '#0b0f19' : '#f5f7fb'
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            gap: 1,
                            alignItems: 'flex-end'
                        }}
                    >
                        {msg.role === 'bot' && (
                            <Avatar
                                src={BotAvatarImg}
                                alt="Bot"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    flexShrink: 0
                                }}
                            />
                        )}
                        <Box
                            sx={{
                                maxWidth: msg.role === 'bot' ? '85%' : '70%',
                                px: 2,
                                py: 1.25,
                                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                bgcolor:
                                    msg.role === 'user'
                                        ? 'primary.main'
                                        : isDarkMode
                                            ? '#1e293b'
                                            : 'white',
                                boxShadow: msg.role === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                                wordBreak: 'break-word'
                            }}
                        >
                            {msg.role === 'bot' && msg.sql ? (
                                // Render structured response with SQL
                                <Box>
                                    {/* SQL Query - hiển thị trước */}
                                    <Box
                                        sx={{
                                            bgcolor: isDarkMode ? '#0f172a' : '#f8fafc',
                                            borderRadius: '8px',
                                            p: 1.5,
                                            mb: 1.5,
                                            border: '1px solid',
                                            borderColor: isDarkMode ? '#334155' : '#e2e8f0'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                                display: 'block',
                                                mb: 0.5
                                            }}
                                        >
                                            🔍 SQL Query:
                                        </Typography>
                                        <Typography
                                            component="pre"
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                color: isDarkMode ? '#22d3ee' : '#0891b2',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all',
                                                m: 0,
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {msg.sql}
                                        </Typography>
                                    </Box>

                                    {/* Kết quả - hiển thị sau */}
                                    <Box
                                        sx={{
                                            bgcolor: isDarkMode ? '#064e3b' : '#ecfdf5',
                                            borderRadius: '8px',
                                            p: 1.5,
                                            border: '1px solid',
                                            borderColor: isDarkMode ? '#065f46' : '#a7f3d0'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: isDarkMode ? '#6ee7b7' : '#059669',
                                                display: 'block',
                                                mb: 0.5,
                                                fontWeight: 600
                                            }}
                                        >
                                            📊 Kết quả:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: isDarkMode ? '#f1f5f9' : '#1a1a1a',
                                                fontWeight: 500,
                                                fontSize: '1rem',
                                                whiteSpace: 'pre-wrap'
                                            }}
                                        >
                                            {msg.answer || msg.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : msg.role === 'bot' && msg.isLoading ? (
                                // Render loading spinner
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: isDarkMode ? '#22d3ee' : '#0891b2'
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: isDarkMode ? '#94a3b8' : '#64748b',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        Đang xử lý...
                                    </Typography>
                                </Box>
                            ) : (
                                // Render normal text
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.5,
                                        whiteSpace: 'pre-wrap',
                                        color: msg.role === 'user'
                                            ? '#ffffff'
                                            : isDarkMode
                                                ? '#f1f5f9'
                                                : '#1a1a1a'
                                    }}
                                >
                                    {msg.content || (msg.isStreaming ? '...' : '')}
                                </Typography>
                            )}
                        </Box>
                        {msg.role === 'user' && (
                            <Avatar
                                sx={{
                                    bgcolor: 'secondary.main',
                                    width: 30,
                                    height: 30,
                                    flexShrink: 0
                                }}
                            >
                                <User size={16} />
                            </Avatar>
                        )}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderTop: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider',
                    bgcolor: isDarkMode ? '#0b0f19' : 'background.paper'
                }}
            >
                {/* Plus Button */}
                <IconButton
                    size="small"
                    sx={{
                        width: 36,
                        height: 36,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                        }
                    }}
                >
                    <Plus size={18} strokeWidth={2.5} />
                </IconButton>

                {/* Input Field Container */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        borderRadius: '24px',
                        px: 2,
                        py: 0.75,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.02)'
                        }
                    }}
                >
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        variant="standard"
                        placeholder="Nhập tin nhắn..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '0.9rem',
                                '& input::placeholder': {
                                    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                                    opacity: 1
                                },
                                color: isDarkMode ? '#ffffff' : 'inherit'
                            }
                        }}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            color: 'warning.main',
                            ml: 0.5,
                            '&:hover': { bgcolor: 'transparent', color: 'warning.dark' }
                        }}
                    >
                        <Smile size={20} />
                    </IconButton>
                </Box>

                {/* Send Button */}
                <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.05)'
                        },
                        '&:disabled': {
                            bgcolor: 'action.disabledBackground',
                            color: 'action.disabled'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Send size={18} />
                </IconButton>
            </Box>
        </Box>
    );
}
