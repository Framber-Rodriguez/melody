# Salomon desktop companion

A small Python launcher for Windows and macOS. It opens the hosted Salomon app and can save a screenshot locally for you to review and manually attach. It does not upload screenshots automatically, listen in the background, read email, click, type, or run commands for an AI model.

## Run

Install Python 3.12 or later with Tkinter support. In the repository root:

```sh
python -m pip install -r desktop/requirements.txt
python desktop/salomon_desktop.py
```

On macOS, use `python3` if required. Allow Screen Recording for Python/Terminal in System Settings when asked. If capturing does not work, use the system screenshot shortcut and upload the image with Salomon's paperclip.

This is source code, not a signed Windows installer or notarized Mac app. Native builds and desktop control remain future work. The web app works without this helper.
