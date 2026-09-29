# SmarTone Business Portal – UI/UX revamp (prototype)

Responsive B2B self-service portal (desktop sidebar layout, mobile bottom-tab layout). Theme colour `#EB2D2D`.
Vanilla HTML/CSS/JS, no build step — run `python3 -m http.server` and open `http://localhost:8000`.

## Demo accounts
| Role | User | Password | OTP |
|---|---|---|---|
| Corp Admin (multi company / account / lines) | `admin` | `Admin@123` | `123456` |
| Line User (own line only) | `mary` | `Line@123` | `123456` |

## Flows
- **Login**: validation, wrong-credential banner, "Login Failed" after 3 attempts, OTP (SMS for admin / email for line user) with resend timer and error state.
- **Home**: company/account switcher (admin only), latest bill, line users, contract alerts, local & roaming usage, quick requests.
- **Contracts**: searchable line list → line detail with usage, Service Plan and SIM Contract sheets.
- **Requests** (multi-step wizards with validation, confirmation and success): Roaming on/off, IDD on/off, SIM replacement (delivery or store pick-up), Service reconnection (payment + receipt upload).

All data is mocked in `js/data.js`.
