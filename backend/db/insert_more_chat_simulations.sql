-- Insert chat simulation for Password & Account Protection (course-2)
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
    'course-2-lesson-7',
    'course-2',
    'Password Security Chat Simulation',
    'chat_simulation',
    '20m',
    '{
        "scenario": {
            "title": "Data Breach Response",
            "description": "You receive a notification about a data breach at a website you use. Let''s see how you handle securing your accounts.",
            "messages": [
                {
                    "id": "msg1",
                    "sender": "system",
                    "text": "You received an email from a website you use: ''We recently discovered a security breach that may have exposed your account information. Please take immediate action to secure your account.''",
                    "timestamp": "10:00 AM"
                },
                {
                    "id": "msg2",
                    "sender": "friend",
                    "text": "Hey, I got that email too! Should we change our passwords?",
                    "timestamp": "10:01 AM"
                },
                {
                    "id": "msg3",
                    "sender": "friend",
                    "text": "I was thinking of using the same strong password I use for my other accounts. That way I won''t forget it.",
                    "timestamp": "10:02 AM",
                    "triggeredBy": "resp1"
                },
                {
                    "id": "msg4",
                    "sender": "friend",
                    "text": "But what about two-factor authentication? Is it really necessary? It seems like a hassle.",
                    "timestamp": "10:03 AM",
                    "triggeredBy": "resp2"
                },
                {
                    "id": "msg5",
                    "sender": "friend",
                    "text": "I found a password manager app. Should I use it? It seems convenient but I''m not sure if it''s safe.",
                    "timestamp": "10:04 AM",
                    "triggeredBy": "resp3"
                }
            ],
            "responses": [
                {
                    "id": "resp1",
                    "text": "Yes, we should change our passwords immediately. Let''s make sure to use strong, unique passwords.",
                    "outcome": "good",
                    "nextResponses": ["resp4", "resp5", "resp6"]
                },
                {
                    "id": "resp2",
                    "text": "No, we should wait to see if our accounts were actually affected.",
                    "outcome": "bad",
                    "nextResponses": ["resp4", "resp5", "resp6"]
                },
                {
                    "id": "resp3",
                    "text": "Let''s just add some numbers to our current passwords.",
                    "outcome": "bad",
                    "nextResponses": ["resp4", "resp5", "resp6"]
                },
                {
                    "id": "resp4",
                    "text": "No, you should use a different strong password for each account. Reusing passwords puts all your accounts at risk.",
                    "outcome": "good",
                    "nextResponses": ["resp7", "resp8", "resp9"]
                },
                {
                    "id": "resp5",
                    "text": "Yes, that''s a good idea! Using the same strong password is better than weak unique ones.",
                    "outcome": "bad",
                    "nextResponses": ["resp7", "resp8", "resp9"]
                },
                {
                    "id": "resp6",
                    "text": "Maybe we should just write down our passwords somewhere safe.",
                    "outcome": "bad",
                    "nextResponses": ["resp7", "resp8", "resp9"]
                },
                {
                    "id": "resp7",
                    "text": "Yes, 2FA is essential! It adds an extra layer of security even if someone gets your password.",
                    "outcome": "good",
                    "nextResponses": ["resp10", "resp11", "resp12"]
                },
                {
                    "id": "resp8",
                    "text": "No, it''s too complicated. A strong password should be enough.",
                    "outcome": "bad",
                    "nextResponses": ["resp10", "resp11", "resp12"]
                },
                {
                    "id": "resp9",
                    "text": "We can skip it for now and add it later if needed.",
                    "outcome": "bad",
                    "nextResponses": ["resp10", "resp11", "resp12"]
                },
                {
                    "id": "resp10",
                    "text": "Yes, but make sure to use a reputable password manager with good security reviews.",
                    "outcome": "good",
                    "nextResponses": []
                },
                {
                    "id": "resp11",
                    "text": "No, it''s safer to remember passwords yourself.",
                    "outcome": "bad",
                    "nextResponses": []
                },
                {
                    "id": "resp12",
                    "text": "Let''s just use the browser''s built-in password saver.",
                    "outcome": "neutral",
                    "nextResponses": []
                }
            ],
            "outcomes": {
                "good": {
                    "title": "Excellent Security Practices!",
                    "description": "You demonstrated strong security awareness by recommending unique passwords, 2FA, and proper password management. These practices significantly reduce the risk of account compromise."
                },
                "bad": {
                    "title": "Security Risk Detected",
                    "description": "Some of your suggestions could put accounts at risk. Remember: password reuse, skipping 2FA, and improper password storage are common security vulnerabilities."
                },
                "neutral": {
                    "title": "Room for Improvement",
                    "description": "While some of your suggestions are okay, consider using more secure methods like dedicated password managers and always enabling 2FA when available."
                }
            }
        }
    }',
    7,
    false
);

-- Insert chat simulation for Data & Device Protection (course-4)
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
    'course-4-lesson-7',
    'course-4',
    'Data Protection Chat Simulation',
    'chat_simulation',
    '20m',
    '{
        "scenario": {
            "title": "Device Disposal",
            "description": "You need to sell your old phone. Let''s see how you handle protecting your data before selling it.",
            "messages": [
                {
                    "id": "msg1",
                    "sender": "friend",
                    "text": "I''m selling my old phone tomorrow. I''ve deleted all my photos and apps. Is there anything else I need to do?",
                    "timestamp": "10:00 AM"
                },
                {
                    "id": "msg2",
                    "sender": "friend",
                    "text": "I was thinking of just doing a quick format. That should be enough, right?",
                    "timestamp": "10:01 AM",
                    "triggeredBy": "resp1"
                },
                {
                    "id": "msg3",
                    "sender": "friend",
                    "text": "What about my SIM card? Should I leave it in the phone?",
                    "timestamp": "10:02 AM",
                    "triggeredBy": "resp2"
                },
                {
                    "id": "msg4",
                    "sender": "friend",
                    "text": "I have some sensitive work emails on there. Should I be worried?",
                    "timestamp": "10:03 AM",
                    "triggeredBy": "resp3"
                },
                {
                    "id": "msg5",
                    "sender": "friend",
                    "text": "The buyer wants to test the phone before paying. Should I let them?",
                    "timestamp": "10:04 AM",
                    "triggeredBy": "resp4"
                }
            ],
            "responses": [
                {
                    "id": "resp1",
                    "text": "Yes, you need to do a proper factory reset and remove your accounts first.",
                    "outcome": "good",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp2",
                    "text": "No, just deleting photos and apps is enough.",
                    "outcome": "bad",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp3",
                    "text": "Let''s check if there''s any other personal data we need to remove.",
                    "outcome": "good",
                    "nextResponses": ["resp5", "resp6", "resp7"]
                },
                {
                    "id": "resp4",
                    "text": "No, a quick format isn''t enough. You need to do a proper factory reset.",
                    "outcome": "good",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp5",
                    "text": "Yes, a format should be enough to remove everything.",
                    "outcome": "bad",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp6",
                    "text": "Maybe we should just delete the sensitive files.",
                    "outcome": "bad",
                    "nextResponses": ["resp8", "resp9", "resp10"]
                },
                {
                    "id": "resp7",
                    "text": "No, you should remove the SIM card. It contains your personal information.",
                    "outcome": "good",
                    "nextResponses": ["resp11", "resp12", "resp13"]
                },
                {
                    "id": "resp8",
                    "text": "Yes, leave it in. The new owner might need it.",
                    "outcome": "bad",
                    "nextResponses": ["resp11", "resp12", "resp13"]
                },
                {
                    "id": "resp9",
                    "text": "It doesn''t matter, the SIM card will be reset anyway.",
                    "outcome": "bad",
                    "nextResponses": ["resp11", "resp12", "resp13"]
                },
                {
                    "id": "resp10",
                    "text": "Yes, you should be concerned. Let''s make sure to properly wipe all data first.",
                    "outcome": "good",
                    "nextResponses": ["resp14", "resp15", "resp16"]
                },
                {
                    "id": "resp11",
                    "text": "No, the factory reset will remove everything.",
                    "outcome": "bad",
                    "nextResponses": ["resp14", "resp15", "resp16"]
                },
                {
                    "id": "resp12",
                    "text": "Let''s just delete the email app.",
                    "outcome": "bad",
                    "nextResponses": ["resp14", "resp15", "resp16"]
                },
                {
                    "id": "resp13",
                    "text": "No, don''t let them test it until after the factory reset.",
                    "outcome": "good",
                    "nextResponses": []
                },
                {
                    "id": "resp14",
                    "text": "Yes, but only after we''ve done the factory reset.",
                    "outcome": "good",
                    "nextResponses": []
                },
                {
                    "id": "resp15",
                    "text": "Yes, they can test it now. We''ve deleted the important stuff.",
                    "outcome": "bad",
                    "nextResponses": []
                },
                {
                    "id": "resp16",
                    "text": "Maybe we should let them test it first to make sure it works.",
                    "outcome": "bad",
                    "nextResponses": []
                }
            ],
            "outcomes": {
                "good": {
                    "title": "Excellent Data Protection!",
                    "description": "You demonstrated strong data protection practices by recommending proper factory reset, SIM card removal, and secure device testing procedures."
                },
                "bad": {
                    "title": "Data Security Risk",
                    "description": "Some of your suggestions could leave sensitive data vulnerable. Remember: proper data wiping, SIM card removal, and secure device handling are essential when selling devices."
                },
                "neutral": {
                    "title": "Security Awareness Needed",
                    "description": "While some of your suggestions are okay, consider implementing more thorough data protection measures when disposing of devices containing sensitive information."
                }
            }
        }
    }',
    7,
    false
); 