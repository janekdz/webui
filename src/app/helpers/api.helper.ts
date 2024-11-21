import { isObject } from 'lodash-es';
import { ApiError } from 'app/interfaces/api-error.interface';
import {
  ErrorResponse,
  RequestMessage,
  IncomingMessage,
  CollectionUpdateMessage,
} from 'app/interfaces/api-message.interface';
import { Job } from 'app/interfaces/job.interface';

export function isApiError(error: unknown): error is ApiError {
  if (error === null) return false;

  return typeof error === 'object'
    && 'error' in error
    && 'extra' in error
    && 'reason' in error
    && 'trace' in error;
}

export function isFailedJob(obj: unknown): obj is Job {
  if (obj === null) return false;

  return typeof obj === 'object'
    && ('state' in obj
      && 'error' in obj
      && 'exception' in obj
      && 'exc_info' in obj);
}

export function isIncomingMessage(something: unknown): something is IncomingMessage {
  return isObject(something) && 'jsonrpc' in something;
}

export function isCollectionUpdateMessage(something: unknown): something is CollectionUpdateMessage {
  return isIncomingMessage(something) && 'method' in something && something.method === 'collection_update';
}

export function isErrorResponse(something: unknown): something is ErrorResponse {
  return isIncomingMessage(something)
    && 'error' in something
    && Boolean(something.error);
}

export function makeRequestMessage(message: Pick<RequestMessage, 'id' | 'method' | 'params'>): RequestMessage {
  return {
    jsonrpc: '2.0',
    ...message,
  };
}
