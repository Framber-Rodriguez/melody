"""Melody screenshot companion for Windows and macOS. No remote control endpoint."""
from pathlib import Path
import sys
import tkinter as tk
from tkinter import messagebox
import webbrowser

URL = 'https://framber-rodriguez.github.io/melody/'

def main():
    root = tk.Tk()
    root.title('Melody · Desktop companion')
    root.geometry('490x360')
    root.configure(bg='#151b17')
    root.resizable(False, False)
    label = lambda text, size=12: tk.Label(root, text=text, bg='#151b17', fg='#d0e7d5', font=('Arial', size), wraplength=420, justify='left')
    label('melody.', 30).pack(anchor='w', padx=32, pady=(26,12))
    label('A little clarity, on your desktop.').pack(anchor='w',padx=32)
    label('Capture a screenshot locally, review it, then attach it to Melody. Nothing is uploaded automatically.').pack(anchor='w',padx=32,pady=18)
    def capture():
        try:
            from PIL import ImageGrab
            root.withdraw()
            def save():
                try:
                    from tkinter import filedialog
                    image = ImageGrab.grab()
                    root.deiconify()
                    name=filedialog.asksaveasfilename(parent=root,title='Save screenshot to review',defaultextension='.png',filetypes=[('PNG image','*.png')],initialfile='melody-screenshot.png')
                    if name:
                        image.save(name)
                        messagebox.showinfo('Screenshot saved','Review your screenshot, then attach it to Melody using the paperclip. Your screenshot has not been uploaded.')
                except Exception:
                    root.deiconify()
                    messagebox.showerror('Screenshot unavailable','Check Screen Recording permissions on macOS, or capture a screenshot with your operating system.')
            root.after(500, save)
        except ImportError:
            messagebox.showerror('Pillow required','Install the desktop requirements before capturing a screenshot: python -m pip install -r desktop/requirements.txt')
    tk.Button(root,text='Open Melody',command=lambda:webbrowser.open(URL),bg='#bedcc6',fg='#17251c',relief='flat',padx=20,pady=10).pack(anchor='w',padx=32,pady=(0,10))
    tk.Button(root,text='Capture screenshot',command=capture,bg='#2c3930',fg='#d0e7d5',relief='flat',padx=20,pady=10).pack(anchor='w',padx=32)
    label('Screenshots only · no app control · no background listening',9).pack(anchor='w',padx=32,pady=18)
    root.mainloop()

if __name__ == '__main__':
    main()
