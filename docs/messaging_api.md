# Messaging API Documentation

## Overview

The messaging system allows podcasters and experts to communicate directly through private messages. This API provides endpoints for sending, receiving, and managing messages between users.

## Authentication

All endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Messages

Retrieves all messages where the authenticated user is either the sender or receiver.

```http
GET /api/messages/
```

#### Response

```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "sender": {
        "id": 1,
        "username": "Benny",
        "email": "behzadjavadian49@gmail.com"
      },
      "receiver": {
        "id": 3,
        "username": "sarahchen",
        "email": "sarah.chen@example.com"
      },
      "content": "Hi Dr. Chen, I'm interested in having you as a guest...",
      "timestamp": "2025-03-26T16:30:00Z",
      "is_read": false,
      "read_at": null,
      "conversation_id": "conversation_1_3"
    }
  ]
}
```

### 2. Get Conversations

Retrieves a list of all conversations for the authenticated user, including the last message and unread count.

```http
GET /api/messages/conversations/
```

#### Response

```json
[
  {
    "conversation_id": "conversation_1_3",
    "other_user": {
      "id": 3,
      "username": "sarahchen",
      "email": "sarah.chen@example.com"
    },
    "last_message": {
      "id": 3,
      "sender": 1,
      "receiver": 3,
      "content": "I'd love to discuss recent developments...",
      "timestamp": "2025-03-26T16:40:00Z",
      "is_read": true,
      "read_at": "2025-03-26T16:41:00Z"
    },
    "unread_count": 0
  }
]
```

### 3. Send a Message

Sends a new message to another user.

```http
POST /api/messages/
```

#### Request Body

```json
{
  "receiver_id": 3,
  "content": "Your message here"
}
```

#### Response

```json
{
  "id": 8,
  "sender": {
    "id": 1,
    "username": "Benny",
    "email": "behzadjavadian49@gmail.com"
  },
  "receiver": {
    "id": 3,
    "username": "sarahchen",
    "email": "sarah.chen@example.com"
  },
  "content": "Your message here",
  "timestamp": "2025-03-26T19:00:00Z",
  "is_read": false,
  "read_at": null,
  "conversation_id": "conversation_1_3"
}
```

### 4. Mark Message as Read

Marks a specific message as read.

```http
POST /api/messages/{message_id}/mark_read/
```

#### Response

```json
{
  "status": "message marked as read"
}
```

### 5. Mark All Messages as Read

Marks all unread messages as read for the authenticated user.

```http
POST /api/messages/mark_all_read/
```

#### Response

```json
{
  "status": "all messages marked as read"
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "Not authorized to mark this message as read"
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

### 400 Bad Request

```json
{
  "receiver_id": ["This field is required."]
}
```

## Message Model Fields

| Field           | Type     | Description                                              |
| --------------- | -------- | -------------------------------------------------------- |
| id              | integer  | Unique identifier for the message                        |
| sender          | object   | User who sent the message                                |
| receiver        | object   | User who received the message                            |
| content         | string   | The message content                                      |
| timestamp       | datetime | When the message was sent                                |
| is_read         | boolean  | Whether the message has been read                        |
| read_at         | datetime | When the message was read (null if unread)               |
| conversation_id | string   | Unique identifier for the conversation between two users |

## Best Practices

1. **Rate Limiting**: The API implements rate limiting to prevent abuse. Monitor the response headers for rate limit information.

2. **Message Content**: Keep messages concise and relevant. The system is designed for professional communication between podcasters and experts.

3. **Read Status**: Use the read status to implement notifications and unread message counts in the UI.

4. **Conversation Management**: Use the `conversation_id` to group messages between the same users.

5. **Error Handling**: Always implement proper error handling for network issues and API errors.
