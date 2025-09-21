/**
 * AgentDemo component for trying agent functionality with limited features.
 * Provides demo interface with usage tracking and limits enforcement.
 */

import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { demoAgent, DemoRequest, DemoResponse } from '../../lib/api/agents';

interface AgentDemoProps {
  agent: Agent;
  userWallet?: string;
  onDemoComplete?: (result: DemoResponse) => void;
  onPurchasePrompt?: () => void;
}

interface DemoState {
  isLoading: boolean;
  result: DemoResponse | null;
  error: string | null;
  inputValues: Record<string, unknown>;
}

export const AgentDemo: React.FC<AgentDemoProps> = ({
  agent,
  userWallet,
  onDemoComplete,
  onPurchasePrompt
}) => {
  const [state, setState] = useState<DemoState>({
    isLoading: false,
    result: null,
    error: null,
    inputValues: {}
  });

  // Reset state when agent changes
  useEffect(() => {
    setState({
      isLoading: false,
      result: null,
      error: null,
      inputValues: {}
    });
  }, [agent.id]);

  const handleInputChange = (field: string, value: unknown) => {
    setState(prev => ({
      ...prev,
      inputValues: {
        ...prev.inputValues,
        [field]: value
      }
    }));
  };

  const handleStartDemo = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const demoRequest: DemoRequest = {
        input: state.inputValues,
        user_wallet: userWallet
      };

      const response = await demoAgent(agent.id, demoRequest);

      if (response.error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Demo failed'
        }));
        return;
      }

      if (response.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          result: response.data!
        }));

        onDemoComplete?.(response.data);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      result: null,
      error: null,
      inputValues: {}
    });
  };

  const renderInputField = (fieldName: string, fieldSchema: Record<string, unknown>) => {
    const value = state.inputValues[fieldName] || '';
    const title = (fieldSchema.title as string) || fieldName;
    const description = fieldSchema.description as string;
    const required = fieldSchema.required as boolean;

    // Simple input rendering based on schema type
    if (fieldSchema.type === 'string') {
      return (
        <div key={fieldName} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={description || `Enter ${fieldName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isLoading}
          />
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      );
    }

    if (fieldSchema.type === 'number') {
      return (
        <div key={fieldName} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            value={value as number}
            onChange={(e) => handleInputChange(fieldName, parseFloat(e.target.value) || 0)}
            placeholder={description || `Enter ${fieldName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.isLoading}
          />
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      );
    }

    if (fieldSchema.type === 'boolean') {
      return (
        <div key={fieldName} className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(fieldName, e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={state.isLoading}
            />
            <span className="text-sm font-medium text-gray-700">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          {description && (
            <p className="text-sm text-gray-500 mt-1 ml-6">{description}</p>
          )}
        </div>
      );
    }

    // Default text input for unknown types
    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleInputChange(fieldName, e.target.value)}
          placeholder={description || `Enter ${fieldName}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={state.isLoading}
        />
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    );
  };

  const renderInputForm = () => {
    if (!agent.inputSchema || Object.keys(agent.inputSchema).length === 0) {
      return (
        <div className="mb-4">
          <p className="text-gray-600">This agent does not require any input parameters.</p>
        </div>
      );
    }

    const properties = (agent.inputSchema.properties as Record<string, Record<string, unknown>>) || {};

    return (
      <div className="space-y-4">
        {Object.entries(properties).map(([fieldName, fieldSchema]) =>
          renderInputField(fieldName, fieldSchema)
        )}
      </div>
    );
  };

  const renderResult = () => {
    if (!state.result) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Demo Result</h4>

        {/* Demo usage info */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            Demo {state.result.demo_count} of {state.result.demo_limit} used
          </p>
          {state.result.demo_count >= state.result.demo_limit && (
            <p className="text-sm text-blue-800 font-medium mt-1">
              Demo limit reached. Purchase full access to continue.
            </p>
          )}
        </div>

        {/* Demo output */}
        {state.result.output && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2">Output:</h5>
            <div className="bg-white p-3 rounded border">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(state.result.output, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Purchase prompt */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800 mb-2">
            This was a limited demo. Purchase full access to unlock complete functionality.
          </p>
          <button
            onClick={onPurchasePrompt}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Purchase Full Access
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Try {agent.name} - Demo
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            FREE DEMO
          </span>
          <span className="text-sm text-gray-500">
            {agent.demoLimit} demos available
          </span>
        </div>
      </div>

      {agent.shortDescription && (
        <p className="text-gray-600 mb-4">{agent.shortDescription}</p>
      )}

      {/* Error display */}
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">{state.error}</p>
        </div>
      )}

      {/* Input form */}
      {!state.result && (
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Demo Input</h4>
          {renderInputForm()}

          <div className="flex space-x-3">
            <button
              onClick={handleStartDemo}
              disabled={state.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? 'Running Demo...' : 'Start Demo'}
            </button>

            {Object.keys(state.inputValues).length > 0 && (
              <button
                onClick={handleReset}
                disabled={state.isLoading}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result display */}
      {renderResult()}

      {/* Try again button */}
      {state.result && (
        <div className="mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Try Another Demo
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentDemo;