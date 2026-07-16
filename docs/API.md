# API Documentation

## GET /api/health

Returns the system status and current model configuration.

**Response:**
```json
{
  "status": "ok",
  "model": "gemini-1.5-flash",
  "timestamp": "2026-07-16T..."
}
```

## POST /api/analyze-chart

Analyzes a base64 encoded trading chart image.

**Request Body:**
```json
{
  "image": "base64_encoded_string_without_prefix"
}
```

**Successful Response:**
```json
{
    "success": true,
    "validChart": true,
    "prediction": "UP",
    "confidence": 86,
    "risk": "Medium",
    "primaryScenario": "Bullish Continuation",
    "alternativeScenario": "Bearish Pullback",
    "reason": "Technical explanation",
    "analysis": {
        "trend": ["Bullish"],
        "marketStructure": ["BOS confirmed"],
        "support": ["1.0543"],
        "resistance": ["1.0620"],
        "liquidity": ["Sell side liquidity taken"],
        "orderBlocks": ["Demand zone at 1.0500"],
        "fairValueGaps": ["Bullish FVG visible"],
        "patterns": ["Morning Star"],
        "momentum": ["High"],
        "volume": ["Rising"]
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Readable error message"
    }
}
```
