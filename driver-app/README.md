# Windhoek City Cab Driver

Expo / React Native driver app with a web preview.

## Development

Run `npm install`, then `npx expo start --web --port 8082`.
The passenger app remains on port 8081.
Set `EXPO_PUBLIC_MAPBOX_TOKEN` in ignored `.env.local` for the Windhoek static map preview. This must be a public, restricted Mapbox token.

## Current Scope

Interactive sample rides: availability, accept/decline, arrival, PIN verification, trip completion, ride history and shift activity. Drivers do not have personal earnings or payout balances. State resets on reload. All sample passengers are fictional. Drive is a full-map workspace: interactive Mapbox on web and a static preview on native. Neither shows live driver location yet.

No real dispatch, driver authentication, payout, masked calling, background GPS or passenger status sync is connected. Native device verification is pending. Do not use this preview for operations.
