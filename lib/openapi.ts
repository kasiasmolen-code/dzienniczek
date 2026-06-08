/**
 * OpenAPI 3.0 Specification for Dzienniczek REST API
 * This serves as the source of truth for API documentation
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Dzienniczek REST API',
    version: '1.0.0',
    description:
      'REST API for Dzienniczek - A Polish diary application with AI-powered insights from Freud',
    contact: {
      name: 'Dzienniczek Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development Server',
    },
    {
      url: 'https://dzienniczek.app/api',
      description: 'Production Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Supabase JWT token in Authorization header',
      },
    },
    schemas: {
      Entry: {
        type: 'object',
        required: ['id', 'user_id', 'content', 'created_at', 'updated_at'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique entry identifier',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
            description: 'User who created the entry',
          },
          title: {
            type: 'string',
            description: 'Entry title',
            example: 'Dzisiejszy dzień',
          },
          content: {
            type: 'string',
            description: 'Main entry content',
            example: 'Miałem niesamowity dzień...',
          },
          mood: {
            type: 'string',
            enum: ['great', 'good', 'neutral', 'bad', 'terrible'],
            nullable: true,
            description: 'Emotional state (1-5 scale)',
            example: 'good',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Associated tags',
            example: ['work', 'family'],
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'When entry was created',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'When entry was last updated',
          },
        },
      },
      Conversation: {
        type: 'object',
        required: ['id', 'user_id', 'created_at', 'updated_at'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique conversation identifier',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
            description: 'User who owns the conversation',
          },
          title: {
            type: 'string',
            nullable: true,
            description: 'Conversation title (auto-generated from first message)',
          },
          entry_id: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Optional link to a diary entry',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Message: {
        type: 'object',
        required: ['id', 'conversation_id', 'role', 'content', 'created_at'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          conversation_id: {
            type: 'string',
            format: 'uuid',
          },
          role: {
            type: 'string',
            enum: ['user', 'assistant'],
            description: 'Who sent the message',
          },
          content: {
            type: 'string',
            description: 'Message text',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            example: 20,
          },
          offset: {
            type: 'integer',
            example: 0,
          },
          total: {
            type: 'integer',
            description: 'Total number of items',
          },
          hasMore: {
            type: 'boolean',
            description: 'Whether there are more items to fetch',
          },
        },
      },
      Error: {
        type: 'object',
        required: ['error', 'code'],
        properties: {
          error: {
            type: 'string',
            description: 'Human-readable error message',
          },
          code: {
            type: 'string',
            description: 'Machine-readable error code',
            enum: ['UNAUTHORIZED', 'VALIDATION_ERROR', 'NOT_FOUND', 'INTERNAL_ERROR'],
          },
          details: {
            type: 'object',
            description: 'Additional error details',
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/entries': {
      post: {
        tags: ['Entries'],
        summary: 'Create a new diary entry',
        description: 'Creates a new diary entry for the authenticated user',
        operationId: 'createEntry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: {
                    type: 'string',
                    description: 'Main entry content (required)',
                    example: 'Dzisiaj miałem świetny dzień!',
                  },
                  title: {
                    type: 'string',
                    description: 'Entry title (optional)',
                    example: 'Mój dzień',
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Entry date in ISO8601 format (optional, defaults to today)',
                  },
                  mood: {
                    type: 'string',
                    enum: ['great', 'good', 'neutral', 'bad', 'terrible'],
                    description: 'Emotional state (optional)',
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags (optional, max 10)',
                    example: ['work', 'friends'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Entry created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Entry' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Entries'],
        summary: 'List user entries',
        description: 'Get paginated list of user entries with optional filtering',
        operationId: 'listEntries',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of entries per page (default: 20, max: 100)',
            schema: { type: 'integer', minimum: 1, maximum: 100 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of entries to skip (default: 0)',
            schema: { type: 'integer', minimum: 0 },
          },
          {
            name: 'mood',
            in: 'query',
            description: 'Filter by mood',
            schema: {
              type: 'string',
              enum: ['great', 'good', 'neutral', 'bad', 'terrible'],
            },
          },
          {
            name: 'tags',
            in: 'query',
            description: 'Filter by tags (comma-separated)',
            schema: { type: 'string' },
          },
          {
            name: 'from_date',
            in: 'query',
            description: 'Filter from date (ISO8601)',
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'to_date',
            in: 'query',
            description: 'Filter to date (ISO8601)',
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort field (default: created_at)',
            schema: { type: 'string', enum: ['created_at', 'updated_at'] },
          },
          {
            name: 'order',
            in: 'query',
            description: 'Sort order (default: desc)',
            schema: { type: 'string', enum: ['asc', 'desc'] },
          },
        ],
        responses: {
          '200': {
            description: 'List of entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Entry' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/entries/{id}': {
      get: {
        tags: ['Entries'],
        summary: 'Get entry by ID',
        description: 'Retrieve a specific diary entry by its ID',
        operationId: 'getEntry',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Entry UUID',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Entry found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Entry' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - Entry belongs to another user',
          },
          '404': {
            description: 'Entry not found',
          },
        },
      },
    },
    '/freud/conversations': {
      post: {
        tags: ['Freud AI'],
        summary: 'Create conversation with Freud',
        description: 'Start a new conversation with Freud AI (optionally linked to an entry)',
        operationId: 'createConversation',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  entry_id: {
                    type: 'string',
                    format: 'uuid',
                    nullable: true,
                    description: 'Optional link to a diary entry',
                  },
                  title: {
                    type: 'string',
                    description: 'Conversation title (optional, auto-generated from first message)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Conversation created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Conversation' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
      get: {
        tags: ['Freud AI'],
        summary: 'List conversations',
        description: 'Get all conversations with Freud',
        operationId: 'listConversations',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'List of conversations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Conversation' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/freud/messages': {
      post: {
        tags: ['Freud AI'],
        summary: 'Send message to Freud',
        description: 'Send a message to Freud and receive a streamed response',
        operationId: 'sendMessage',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['conversation_id', 'content'],
                properties: {
                  conversation_id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the conversation',
                  },
                  content: {
                    type: 'string',
                    description: 'Message content',
                    example: 'Czuję się smutny dzisiaj...',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Server-sent event stream of Freud response',
            content: {
              'text/event-stream': {
                schema: {
                  type: 'string',
                  description: 'Streamed response chunks',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - Conversation not owned by user',
          },
          '404': {
            description: 'Conversation not found',
          },
        },
      },
      get: {
        tags: ['Freud AI'],
        summary: 'Get messages from conversation',
        description: 'Retrieve messages from a specific conversation',
        operationId: 'getMessages',
        parameters: [
          {
            name: 'conversation_id',
            in: 'query',
            required: true,
            description: 'Conversation UUID',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'List of messages',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Message' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
  },
}
