"use client";
import { useState, useEffect, useRef } from "react";

const AddressInput = ({
  receiver,
  setReceiver,
  validationErrors,
  setValidationErrors,
  onAddressChange,
  onValidationStatusChange
}) => {
  // Address validation states
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationReasons, setValidationReasons] = useState([]);

  // Handle click outside to close suggestions
  const handleClickOutside = (event) => {
    // Check if click is outside any of the address input containers
    const addressContainers = document.querySelectorAll('[data-address-field]');
    let clickedOutside = true;
    
    addressContainers.forEach(container => {
      if (container.contains(event.target)) {
        clickedOutside = false;
      }
    });
    
    if (clickedOutside) {
      setShowSuggestions(false);
      setActiveField(null);
    }
  };

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle regular input changes (non-address fields)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiver(prev => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle address input with validation
  const handleAddressInput = async (e) => {
    const { name, value } = e.target;
    const updatedReceiver = { ...receiver, [name]: value };
    setReceiver(updatedReceiver);

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Show suggestions for the current field
    setActiveField(name);
    setShowSuggestions(true);

    const totalChars =
      updatedReceiver.address.length +
      updatedReceiver.address2.length +
      updatedReceiver.city.length +
      updatedReceiver.region.length +
      updatedReceiver.postalCode.length;

    if (totalChars < 3) {
      setAddressSuggestions([]);
      setIsFetchingAddress(false);
      return;
    }

    setIsFetchingAddress(true);
    try {
      const apiUrl = `/api/shippo-validate?address_line_1=${encodeURIComponent(
        updatedReceiver.address
      )}&address_line_2=${encodeURIComponent(
        updatedReceiver.address2
      )}&city_locality=${encodeURIComponent(
        updatedReceiver.city
      )}&state_province=${encodeURIComponent(
        updatedReceiver.region
      )}&postal_code=${encodeURIComponent(
        updatedReceiver.postalCode
      )}&country_code=${encodeURIComponent(updatedReceiver.location ?? "US")}`;

      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to validate address via /api/shippo-validate.");
      }
      const data = await response.json();

      // Reset states
      setAddressSuggestions([]);
      setValidationResult(null);
      setValidationReasons([]);

      console.log('Shippo API Response:', data);

      // Check for recommended address from Shippo
      if (data.validation?.shippo_response?.recommended_address) {
        setAddressSuggestions([data.validation.shippo_response.recommended_address]);
      } else if (data.validation?.shippo_response?.suggestions && data.validation.shippo_response.suggestions.length > 0) {
        setAddressSuggestions(data.validation.shippo_response.suggestions);
      } else if (data.suggestions && data.suggestions.length > 0) {
        setAddressSuggestions(data.suggestions);
      }

      // Check validation result and reasons
      if (data.validation?.shippo_response?.analysis?.validation_result) {
        const validationData = data.validation.shippo_response.analysis.validation_result;
        setValidationResult(validationData.value);

        // Mark as validated if address is valid
        if (onValidationStatusChange) {
          onValidationStatusChange(validationData.value === 'valid');
        }

        if (validationData.reasons && validationData.reasons.length > 0) {
          setValidationReasons(validationData.reasons);
        }
      }
    } catch (error) {
      console.error("Error validating address:", error);
      setAddressSuggestions([]);
      setValidationResult(null);
      setValidationReasons([]);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Handle field focus to show suggestions
  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
    if (addressSuggestions.length > 0 || validationResult || validationReasons.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Get validation status color and text
  const getValidationStatusInfo = (status) => {
    switch (status) {
      case 'valid':
        return { color: 'text-green-600', bgColor: 'bg-green-50', text: '✓ Address is valid' };
      case 'partially_valid':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', text: '⚠ Address partially valid' };
      case 'invalid':
        return { color: 'text-red-600', bgColor: 'bg-red-50', text: '✗ Address invalid' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', text: 'Validating...' };
    }
  };

  // Handle selecting a suggested address
  const handleSelectSuggestedAddress = (suggestion) => {
    const updatedReceiver = {
      ...receiver,
      address: suggestion.address_line_1 || receiver.address,
      address2: suggestion.address_line_2 || receiver.address2,
      city: suggestion.city_locality || receiver.city,
      region: suggestion.state_province || receiver.region,
      postalCode: suggestion.postal_code || receiver.postalCode,
      location: suggestion.country_code || receiver.location,
    };

    setReceiver(updatedReceiver);
    setShowSuggestions(false);
    setActiveField(null);

    // Mark address as validated
    if (onValidationStatusChange) {
      onValidationStatusChange(true);
    }

    // Trigger callback to fetch new rates
    if (onAddressChange) {
      onAddressChange();
    }
  };

  // Function to format address for display
  const formatAddressDisplay = (suggestion) => {
    // If complete_address is available, use it
    if (suggestion.complete_address) {
      return suggestion.complete_address.replace(/;/g, ',');
    }

    // Otherwise, build the address from components
    const parts = [];
    if (suggestion.address_line_1) {
      parts.push(suggestion.address_line_1);
    }
    if (suggestion.address_line_2) {
      parts.push(suggestion.address_line_2);
    }

    const cityStateZip = [];
    if (suggestion.city_locality) {
      cityStateZip.push(suggestion.city_locality);
    }
    if (suggestion.state_province) {
      cityStateZip.push(suggestion.state_province);
    }
    if (suggestion.postal_code) {
      cityStateZip.push(suggestion.postal_code);
    }

    if (cityStateZip.length > 0) {
      parts.push(cityStateZip.join(' '));
    }

    return parts.join(', ') || 'Recommended address';
  };

  // Render dropdown with suggestions only
  const renderDropdown = () => {
    if (!showSuggestions) return null;

    return (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-w-md top-full left-0">
        {isFetchingAddress ? (
          <div className="p-3 text-sm text-gray-500">Validating address...</div>
        ) : (
          <>
            {/* Validation Status */}
            {validationResult && (
              <div className={`p-3 border-b border-gray-200 ${getValidationStatusInfo(validationResult).bgColor}`}>
                <div className={`text-sm font-medium ${getValidationStatusInfo(validationResult).color}`}>
                  {getValidationStatusInfo(validationResult).text}
                </div>
              </div>
            )}

            {/* Recommended Address from Shippo */}
            {addressSuggestions.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-blue-50 text-xs font-medium text-blue-700 border-b border-gray-200">
                  Recommended Address:
                </div>
                {addressSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectSuggestedAddress(suggestion)}
                  >
                    <div className="font-medium text-gray-900">
                      {formatAddressDisplay(suggestion)}
                    </div>
                    {suggestion.confidence_result && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ {suggestion.confidence_result.score} confidence - {suggestion.confidence_result.description}
                      </div>
                    )}
                    <div className="text-xs text-blue-600 mt-1">
                      Click to use this address
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Reasons */}
            {validationReasons.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 border-b border-gray-200">
                  Validation Details:
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {validationReasons.map((reason, idx) => (
                    <div key={idx} className="p-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          reason.type === 'correction' ? 'bg-yellow-400' :
                          reason.type === 'error' ? 'bg-red-400' :
                          reason.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                        }`}></span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 capitalize">
                            {reason.type || 'Info'}: {reason.code?.replace(/_/g, ' ') || 'Validation issue'}
                          </div>
                          {reason.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {reason.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No suggestions and no validation result */}
            {!validationResult && addressSuggestions.length === 0 && validationReasons.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No validation results found</div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative" data-address-field="address">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={receiver.address}
            onChange={handleAddressInput}
            onFocus={() => handleFieldFocus('address')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {validationErrors.address && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
          )}
          {activeField === 'address' && renderDropdown()}
        </div>

        <div className="relative" data-address-field="address2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment/Suite
          </label>
          <input
            type="text"
            name="address2"
            value={receiver.address2}
            onChange={handleAddressInput}
            onFocus={() => handleFieldFocus('address2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apt 123"
          />
          {activeField === 'address2' && renderDropdown()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative" data-address-field="city">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={receiver.city}
            onChange={handleAddressInput}
            onFocus={() => handleFieldFocus('city')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="San Francisco"
          />
          {validationErrors.city && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
          )}
          {activeField === 'city' && renderDropdown()}
        </div>

        <div className="relative" data-address-field="region">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province *
          </label>
          <input
            type="text"
            name="region"
            value={receiver.region}
            onChange={handleAddressInput}
            onFocus={() => handleFieldFocus('region')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.region ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="CA"
          />
          {validationErrors.region && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.region}</p>
          )}
          {activeField === 'region' && renderDropdown()}
        </div>

        <div className="relative" data-address-field="postalCode">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={receiver.postalCode}
            onChange={handleAddressInput}
            onFocus={() => handleFieldFocus('postalCode')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="94103"
            readOnly
          />
          {validationErrors.postalCode && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.postalCode}</p>
          )}
          {activeField === 'postalCode' && renderDropdown()}
        </div>
      </div>

      <div className="w-full sm:w-1/3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <input
          type="text"
          name="location"
          value={receiver.location}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="US"
          readOnly
        />
      </div>
    </div>
  );
};

export default AddressInput;