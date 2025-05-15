import { useEffect, useRef, useState } from 'react';

interface CollaborationMessage {
    type: 'update' | 'init';
    file: string;
    content: string;
    timestamp?: number;
}

export const useCollaboration = (initialFile: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [currentContent, setCurrentContent] = useState('');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Подключаемся к WebSocket серверу
        const ws = new WebSocket('ws://192.168.140.196:8081');
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            console.log('Connected to collaboration server');
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('Disconnected from collaboration server');
        };

        ws.onmessage = (event) => {
            try {
                const message: CollaborationMessage = JSON.parse(event.data);
                
                if (message.file === initialFile) {
                    if (message.type === 'init' || message.type === 'update') {
                        setCurrentContent(message.content);
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        return () => {
            ws.close();
        };
    }, [initialFile]);

    const updateContent = (newContent: string) => {
        if (wsRef.current && isConnected) {
            wsRef.current.send(JSON.stringify({
                type: 'update',
                file: initialFile,
                content: newContent
            }));
        }
    };

    return {
        isConnected,
        currentContent,
        updateContent
    };
}; 