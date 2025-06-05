-- Insert the chat simulation lesson for course-1
INSERT INTO lessons (
    id,
    course_id,
    title,
    type,
    duration,
    content,
    order_num,
    completed
) VALUES (
    'course-1-lesson-7',
    'course-1',
    'Phishing Chat Simulation',
    'chat_simulation',
    '20m',
    '{
        "scenario": {
            "title": "Suspicious Job Offer",
            "description": "You receive a message from someone claiming to be a recruiter offering a high-paying remote job. Let''s see how you handle this situation.",
            "messages": [
                {
                    "id": "msg1",
                    "sender": "recruiter",
                    "text": "Hi! I''m Sarah from TechRecruit. I found your profile and we have a perfect remote position that pays $5000/month. Are you interested?",
                    "timestamp": "10:00 AM"
                },
                {
                    "id": "msg2",
                    "sender": "recruiter",
                    "text": "Great! The position is for a Data Entry Specialist. We''ll need you to fill out some forms and provide your bank details for direct deposit. Can you send me your resume and bank information?",
                    "timestamp": "10:01 AM",
                    "triggeredBy": "resp1"
                },
                {
                    "id": "msg3",
                    "sender": "recruiter",
                    "text": "Of course! We''re a leading tech company based in Singapore. The position is fully remote and requires no experience. We''ll provide all training. Would you like to proceed with the application?",
                    "timestamp": "10:01 AM",
                    "triggeredBy": "resp2"
                },
                {
                    "id": "msg4",
                    "sender": "recruiter",
                    "text": "Perfect! Please send your resume, bank details, and a copy of your ID. We''ll process your application right away and send you the first payment within 24 hours.",
                    "timestamp": "10:02 AM",
                    "triggeredBy": "resp3"
                },
                {
                    "id": "msg5",
                    "sender": "recruiter",
                    "text": "Are you sure? This is a limited-time opportunity with great benefits. We can start the process right now and you''ll receive your first payment tomorrow!",
                    "timestamp": "10:02 AM",
                    "triggeredBy": "resp4"
                },
                {
                    "id": "msg6",
                    "sender": "recruiter",
                    "text": "I understand your concern. We''re a legitimate company registered in Singapore. Here''s our website: techrecruit-sg.com. Would you like to proceed with the application?",
                    "timestamp": "10:03 AM",
                    "triggeredBy": "resp5"
                },
                {
                    "id": "msg7",
                    "sender": "recruiter",
                    "text": "Excellent! Please send your documents to recruitment@techrecruit-sg.com. We''ll process everything immediately.",
                    "timestamp": "10:03 AM",
                    "triggeredBy": "resp6"
                },
                {
                    "id": "msg8",
                    "sender": "recruiter",
                    "text": "I understand. But this is a rare opportunity. The position pays $5000/month for just 4 hours of work daily. Are you sure you want to miss out?",
                    "timestamp": "10:04 AM",
                    "triggeredBy": "resp7"
                }
            ],
            "responses": [
                {
                    "id": "resp1",
                    "text": "Yes, I''m interested. Can you tell me more about the position?",
                    "outcome": "neutral",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp2",
                    "text": "That sounds suspicious. Can you provide more information about your company?",
                    "outcome": "good",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp3",
                    "text": "I''ll send my resume and bank details right away!",
                    "outcome": "bad",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp4",
                    "text": "I''m not comfortable sharing my bank details. I''ll pass on this opportunity.",
                    "outcome": "good",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp5",
                    "text": "I''d like to verify your company first. Can you provide your company registration number?",
                    "outcome": "good",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp6",
                    "text": "Sure, I''ll send my documents right away!",
                    "outcome": "bad",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp7",
                    "text": "I''m not comfortable proceeding. I''ll need to do more research first.",
                    "outcome": "good",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp8",
                    "text": "I''m going to report this to the authorities. This is clearly a scam.",
                    "outcome": "good",
                    "nextResponses": []
                },
                {
                    "id": "resp9",
                    "text": "I''ll send my documents now. When will I receive my first payment?",
                    "outcome": "bad",
                    "nextResponses": []
                },
                {
                    "id": "resp10",
                    "text": "I''m blocking you. This is definitely a phishing attempt.",
                    "outcome": "good",
                    "nextResponses": []
                }
            ],
            "outcomes": {
                "good": {
                    "title": "Good Job!",
                    "description": "You correctly identified this as a potential phishing attempt. Never share sensitive information like bank details with unknown recruiters, especially when they pressure you to act quickly."
                },
                "bad": {
                    "title": "Be Careful!",
                    "description": "Sharing bank details with unknown recruiters is risky. Legitimate companies won''t ask for sensitive information before proper verification. Always verify the company and recruiter before sharing personal information."
                },
                "neutral": {
                    "title": "Stay Alert",
                    "description": "While asking for more information is good, be cautious of high-paying remote jobs that require no experience. Research the company thoroughly before proceeding."
                }
            }
        }
    }',
    7,
    false
); 