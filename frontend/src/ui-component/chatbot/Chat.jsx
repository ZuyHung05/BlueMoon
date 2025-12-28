import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Avatar } from '@mui/material';
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

        // Add a placeholder for bot response
        const botMessageId = Date.now() + 1;
        setMessages((prev) => [...prev, { id: botMessageId, role: 'bot', content: '', isStreaming: true }]);

        try {
            const response = await fetch('http://localhost:8000/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue })
            });

            if (!response.ok || !response.body) {
                throw new Error('Không thể kết nối đến server');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullText = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;

                // Update bot message with streamed content
                setMessages((prev) => prev.map((msg) => (msg.id === botMessageId ? { ...msg, content: fullText } : msg)));
            }

            // Mark streaming as complete
            setMessages((prev) => prev.map((msg) => (msg.id === botMessageId ? { ...msg, isStreaming: false } : msg)));
        } catch (error) {
            console.error('Backend streaming error:', error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === botMessageId ? { ...msg, content: '⚠️ Lỗi kết nối. Vui lòng thử lại!', isStreaming: false } : msg
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
                                maxWidth: '70%',
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
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    lineHeight: 1.5,
                                    color: msg.role === 'user' 
                                        ? '#ffffff' 
                                        : isDarkMode 
                                            ? '#f1f5f9' 
                                            : '#1a1a1a'
                                }}
                            >
                                {msg.content || (msg.isStreaming ? '...' : '')}
                            </Typography>
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
