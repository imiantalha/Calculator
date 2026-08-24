<?php
$profile = [
    'name' => 'Muhammad Talha',
    'github' => 'https://github.com/imiantalha',
    // Replace these placeholders with your public profile URLs.
    'portfolio' => '#',
    'fiverr' => '#',
    'upwork' => '#',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A fast, modern and responsive calculator created by Muhammad Talha.">
    <meta name="theme-color" content="#0f172a">
    <title>Calculator — Muhammad Talha</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="page-shell">
        <section class="calculator-card" aria-label="Calculator application">
            <header class="app-header">
                <div>
                    <span class="eyebrow">Simple. Fast. Precise.</span>
                    <h1>Calculator</h1>
                </div>
                <div class="header-actions">
                    <button type="button" class="mode-button" data-mode-toggle aria-label="Switch to scientific calculator">SCI</button>
                    <button type="button" class="icon-button" data-history-toggle aria-label="Open calculation history" aria-expanded="false">↺</button>
                    <button type="button" class="icon-button" data-theme-toggle aria-label="Switch to dark theme">☾</button>
                </div>
            </header>

            <section class="display-panel" aria-label="Calculator result">
                <div class="expression" data-expression aria-hidden="true">0</div>
                <output class="result" data-display aria-live="polite">0</output>
                <div class="display-tools">
                    <span class="status" data-status hidden></span>
                    <button type="button" class="copy-button" data-copy-result aria-label="Copy result">Copy</button>
                </div>
            </section>

            <div class="mode-toolbar" data-scientific-tools hidden>
                <button type="button" class="angle-button" data-angle-toggle>DEG</button>
                <span>Scientific mode</span>
            </div>

            <div class="memory-bar" aria-label="Memory functions">
                <button type="button" data-memory="clear">MC</button>
                <button type="button" data-memory="recall">MR</button>
                <button type="button" data-memory="add">M+</button>
                <button type="button" data-memory="subtract">M−</button>
                <button type="button" data-memory="store">MS</button>
            </div>

            <div class="scientific-keypad" data-scientific-keypad hidden>
                <button type="button" class="key key-scientific" data-value="sin(">sin</button>
                <button type="button" class="key key-scientific" data-value="cos(">cos</button>
                <button type="button" class="key key-scientific" data-value="tan(">tan</button>
                <button type="button" class="key key-scientific" data-value="sqrt(">√</button>
                <button type="button" class="key key-scientific" data-value="ln(">ln</button>
                <button type="button" class="key key-scientific" data-value="log(">log</button>
                <button type="button" class="key key-scientific" data-value="^">xʸ</button>
                <button type="button" class="key key-scientific" data-action="factorial">x!</button>
                <button type="button" class="key key-scientific" data-value="(">(</button>
                <button type="button" class="key key-scientific" data-value=")">)</button>
                <button type="button" class="key key-scientific" data-value="π">π</button>
                <button type="button" class="key key-scientific" data-value="e">e</button>
            </div>

            <div class="keypad" data-keypad>
                <button type="button" class="key key-action" data-action="clear">AC</button>
                <button type="button" class="key key-action" data-action="sign" aria-label="Toggle positive or negative">±</button>
                <button type="button" class="key key-action" data-action="percent">%</button>
                <button type="button" class="key key-operator" data-value="÷" aria-label="Divide">÷</button>

                <button type="button" class="key" data-value="7">7</button>
                <button type="button" class="key" data-value="8">8</button>
                <button type="button" class="key" data-value="9">9</button>
                <button type="button" class="key key-operator" data-value="×" aria-label="Multiply">×</button>

                <button type="button" class="key" data-value="4">4</button>
                <button type="button" class="key" data-value="5">5</button>
                <button type="button" class="key" data-value="6">6</button>
                <button type="button" class="key key-operator" data-value="-">−</button>

                <button type="button" class="key" data-value="1">1</button>
                <button type="button" class="key" data-value="2">2</button>
                <button type="button" class="key" data-value="3">3</button>
                <button type="button" class="key key-operator" data-value="+">+</button>

                <button type="button" class="key key-action" data-action="backspace" aria-label="Backspace">⌫</button>
                <button type="button" class="key key-zero" data-value="0">0</button>
                <button type="button" class="key" data-value=".">.</button>
                <button type="button" class="key key-equals" data-action="equals" aria-label="Equals">=</button>
            </div>

            <aside class="history-panel" data-history-panel aria-label="Calculation history" hidden>
                <div class="history-header">
                    <div>
                        <span class="eyebrow">Your calculations</span>
                        <h2>History</h2>
                    </div>
                    <button type="button" class="text-button" data-clear-history>Clear</button>
                </div>
                <div class="history-list" data-history-list>
                    <p class="empty-state">No calculations yet.</p>
                </div>
            </aside>

            <footer class="app-footer">
                <p>Created with care by <strong><?php echo htmlspecialchars($profile['name'], ENT_QUOTES, 'UTF-8'); ?></strong></p>
                <nav aria-label="Creator links">
                    <a href="<?php echo htmlspecialchars($profile['github'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="<?php echo htmlspecialchars($profile['portfolio'], ENT_QUOTES, 'UTF-8'); ?>" <?php echo $profile['portfolio'] === '#' ? 'aria-disabled="true"' : 'target="_blank" rel="noopener noreferrer"'; ?>>Portfolio</a>
                    <a href="<?php echo htmlspecialchars($profile['fiverr'], ENT_QUOTES, 'UTF-8'); ?>" <?php echo $profile['fiverr'] === '#' ? 'aria-disabled="true"' : 'target="_blank" rel="noopener noreferrer"'; ?>>Fiverr</a>
                    <a href="<?php echo htmlspecialchars($profile['upwork'], ENT_QUOTES, 'UTF-8'); ?>" <?php echo $profile['upwork'] === '#' ? 'aria-disabled="true"' : 'target="_blank" rel="noopener noreferrer"'; ?>>Upwork</a>
                </nav>
                <small>Keyboard supported · Esc clears · H opens history · S toggles scientific mode</small>
            </footer>
        </section>
    </main>
    <script src="app.js" defer></script>
</body>
</html>
