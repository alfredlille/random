import datetime
import pyttsx3

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak(text):
    """Function to speak the given text."""
    engine.say(text)
    engine.runAndWait()

def get_current_time():
    """Function to get the current time."""
    current_time = datetime.datetime.now().strftime("%I:%M %p")
    return current_time

def main():
    """Main function."""
    current_time = get_current_time()
    speak("The current time is " + current_time)

if __name__ == "__main__":
    main()
