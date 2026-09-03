import React, { useEffect, useRef, useState } from "react";
import { s } from "../styles";
import {
  getSpeechRecognition,
  interpretCommand,
  speak,
  stopSpeaking,
} from "../utils/voiceAssistant";

const FARMER_HINTS = [
  "Add organic turmeric for 200 rupees",
  "Set Sona Masuri Rice stock to 40",
  "Change ghee price to 700",
  "List my products",
];

const CUSTOMER_HINTS = [
  "Add turmeric to cart",
  "How much is ghee?",
  "Show me spices",
  "Open Azad Agro",
];

export function VoiceAssistant({
  role: roleProp,
  onRoleChange,
  context,
  onActions,
  open: openProp,
  onOpenChange,
}) {
  const [open, setOpen] = useState(Boolean(openProp));
  const [role, setRole] = useState(roleProp || "farmer");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (roleProp) setRole(roleProp);
  }, [roleProp]);

  useEffect(() => {
    if (typeof openProp === "boolean") setOpen(openProp);
  }, [openProp]);

  useEffect(() => () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      /* ignore */
    }
    stopSpeaking();
  }, []);

  const setOpenSafe = (next) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const setRoleSafe = (next) => {
    setRole(next);
    onRoleChange?.(next);
  };

  const pushLog = (entry) => {
    setLog((prev) => [...prev.slice(-8), entry]);
  };

  const runText = async (text) => {
    const cleaned = String(text || "").trim();
    if (!cleaned) return;
    setBusy(true);
    setError("");
    setTranscript(cleaned);
    pushLog({ who: "you", text: cleaned });
    try {
      const result = interpretCommand(cleaned, { ...context, role });
      const message = result.reply || "Done.";
      setReply(message);
      pushLog({ who: "ai", text: message });
      if (result.actions?.length) {
        await onActions?.(result.actions, { role, text: cleaned });
      }
      if (voiceOn) speak(message);
    } catch (err) {
      const msg = "Something went wrong running that request.";
      setError(msg);
      setReply(msg);
      if (voiceOn) speak(msg);
    } finally {
      setBusy(false);
      setDraft("");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      /* ignore */
    }
    setListening(false);
  };

  const startListening = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError("Voice input isn’t supported in this browser. Type your request below.");
      return;
    }
    setError("");
    stopSpeaking();
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onerror = (e) => {
        setListening(false);
        if (e.error === "not-allowed") {
          setError("Microphone permission blocked. Allow the mic, or type instead.");
        } else if (e.error !== "aborted") {
          setError("Couldn’t hear that. Try again or type it.");
        }
      };
      recognition.onend = () => setListening(false);
      recognition.onresult = (event) => {
        let interim = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const chunk = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) finalText += chunk;
          else interim += chunk;
        }
        const shown = (finalText || interim).trim();
        if (shown) setTranscript(shown);
        if (finalText.trim()) {
          runText(finalText.trim());
        }
      };
      recognition.start();
    } catch {
      setError("Couldn’t start the microphone. Type your request instead.");
      setListening(false);
    }
  };

  const toggleMic = () => {
    if (listening) stopListening();
    else startListening();
  };

  const hints = role === "farmer" ? FARMER_HINTS : CUSTOMER_HINTS;

  return (
    <>
      <button
        type="button"
        style={{
          ...s.voiceFab,
          ...(listening ? s.voiceFabListening : null),
          ...(open ? s.voiceFabOpen : null),
        }}
        onClick={() => setOpenSafe(!open)}
        aria-label={open ? "Close voice assistant" : "Open voice assistant"}
        title="Talk to AI"
      >
        <span aria-hidden="true">{listening ? "●" : "🎙"}</span>
        <span style={s.voiceFabLabel}>Talk to AI</span>
      </button>

      {open && (
        <aside style={s.voicePanel} aria-label="Voice AI assistant">
          <div style={s.voicePanelHead}>
            <div>
              <div style={s.voicePanelTitle}>Voice AI assistant</div>
              <div style={s.voicePanelSub}>
                Speak or type — I’ll update the farm page or help you shop.
              </div>
            </div>
            <button type="button" style={s.iconBtn} onClick={() => setOpenSafe(false)} aria-label="Close">
              ✕
            </button>
          </div>

          <div style={s.voiceRoleRow} role="radiogroup" aria-label="Who are you">
            <button
              type="button"
              role="radio"
              aria-checked={role === "farmer"}
              style={{
                ...s.voiceRoleBtn,
                ...(role === "farmer" ? s.voiceRoleBtnActive : null),
              }}
              onClick={() => setRoleSafe("farmer")}
            >
              I’m a farmer
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === "customer"}
              style={{
                ...s.voiceRoleBtn,
                ...(role === "customer" ? s.voiceRoleBtnActive : null),
              }}
              onClick={() => setRoleSafe("customer")}
            >
              I’m a customer
            </button>
          </div>

          <div style={s.voiceMicRow}>
            <button
              type="button"
              style={{
                ...s.voiceMicBtn,
                ...(listening ? s.voiceMicBtnActive : null),
              }}
              onClick={toggleMic}
              disabled={busy}
            >
              {listening ? "Listening… tap to stop" : "Tap to talk"}
            </button>
            <label style={s.voiceToggle}>
              <input
                type="checkbox"
                checked={voiceOn}
                onChange={(e) => setVoiceOn(e.target.checked)}
              />
              AI voice replies
            </label>
          </div>

          {error ? <p style={s.voiceError}>{error}</p> : null}

          <div style={s.voiceTranscriptBox}>
            <div style={s.voiceMeta}>You said</div>
            <p style={s.voiceTranscript}>{transcript || "—"}</p>
            <div style={{ ...s.voiceMeta, marginTop: 10 }}>AI</div>
            <p style={s.voiceReply}>{reply || "Ready when you are."}</p>
          </div>

          <form
            style={s.voiceTypeRow}
            onSubmit={(e) => {
              e.preventDefault();
              runText(draft);
            }}
          >
            <input
              style={s.input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                role === "farmer"
                  ? "Type: add turmeric for 200 rupees"
                  : "Type: add turmeric to cart"
              }
              aria-label="Type a request"
            />
            <button type="submit" style={s.voiceSendBtn} disabled={busy || !draft.trim()}>
              Go
            </button>
          </form>

          <div style={s.voiceHints}>
            <div style={s.voiceMeta}>Try saying</div>
            <div style={s.voiceHintChips}>
              {hints.map((h) => (
                <button key={h} type="button" style={s.voiceHintChip} onClick={() => runText(h)}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          {log.length > 0 && (
            <div style={s.voiceLog}>
              {log.map((item, i) => (
                <p key={`${item.who}-${i}`} style={s.voiceLogLine}>
                  <strong>{item.who === "you" ? "You" : "AI"}:</strong> {item.text}
                </p>
              ))}
            </div>
          )}
        </aside>
      )}
    </>
  );
}
