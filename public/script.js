/* ==========================================================================
   QVIT OS - Interactive Mechanics (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active');
        
        // Animated hamburger toggle
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });


    // --- SCROLL SPY ACTIVE NAV STATE ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    });


    // --- FRAMEWORK TABS SYSTEM ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            
            // Toggle buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Toggle panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetId) {
                    panel.classList.add('active');
                }
            });
        });
    });


    // --- SYSTEM REQUIREMENTS TABS SYSTEM ---
    const reqTabButtons = document.querySelectorAll('.req-tab-btn');
    const reqPanels = document.querySelectorAll('.req-panel');

    reqTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            
            reqTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            reqPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetId) {
                    panel.classList.add('active');
                }
            });
        });
    });


    // --- FAQ ACCORDION ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            
            // Check if already open
            const isOpen = item.classList.contains('open');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('open');
                faqItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    // --- TERMINAL SIMULATOR ---
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const commandItems = document.querySelectorAll('.cmd-item');

    // Focus terminal input when clicking terminal body
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    // Handle command submissions
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            executeTerminalCommand(command);
            terminalInput.value = '';
        }
    });

    // Handle clicking side-panel commands
    commandItems.forEach(item => {
        item.addEventListener('click', () => {
            const cmd = item.getAttribute('data-cmd');
            terminalInput.value = cmd;
            executeTerminalCommand(cmd);
            terminalInput.value = '';
            
            // Scroll terminal to input
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });
    });

    function executeTerminalCommand(cmd) {
        if (!cmd) return;
        
        // 1. Output the typed command
        writeLine(`qvit@quantum-node:~$ ${cmd}`, 'prompt-echo');
        
        // 2. Parse command
        const cmdLower = cmd.toLowerCase().replace(/\s+/g, ' ');
        
        setTimeout(() => {
            switch(cmdLower) {
                case 'help':
                    writeLine('Available Commands:', 'output-info');
                    writeLine('  quantumctl status   - Display system environment status');
                    writeLine('  quantumctl verify   - Audit the 5 conda quantum environments');
                    writeLine('  quantumctl doctor   - Perform toolchain & compiler sanity checks');
                    writeLine('  quantumctl notebook - Launch isolated JupyterLab notebook server');
                    writeLine('  quantumctl qiskit   - Activate qiskit_env environment');
                    writeLine('  quantumctl qml      - Activate qml_env environment');
                    writeLine('  quantumctl crypto   - Activate quantum_crpto environment');
                    writeLine('  quantumctl pennylane- Activate penny_lane environment');
                    writeLine('  quantumctl tfq      - Activate tfq_env environment');
                    writeLine('  clear               - Empty the terminal workspace');
                    break;
                    
                case 'clear':
                    terminalBody.innerHTML = '';
                    break;
                    
                case 'quantumctl status':
                    writeLine('========================================', 'output-info');
                    writeLine('QVIT OS CLI CORE — Version 1.0 (LTS)', 'output-info');
                    writeLine('========================================', 'output-info');
                    writeLine('Base Distribution : Ubuntu Server 24.04 Core', 'output-muted');
                    writeLine('Desktop Host      : KDE Plasma / SDDM', 'output-muted');
                    writeLine('Uptime            : 14 hrs, 32 mins', 'output-muted');
                    writeLine('Virtualization    : VMware / VirtualBox Integration Active', 'output-muted');
                    writeLine('Conda Base Path   : /opt/miniconda3/envs/', 'output-muted');
                    writeLine('Active Environments (5):', 'output-info');
                    writeLine('  - qiskit_env       - qml_env', 'output-muted');
                    writeLine('  - quantum_crpto    - penny_lane', 'output-muted');
                    writeLine('  - tfq_env', 'output-muted');
                    writeLine('Active Environment: (base) -> local scientific stack active', 'output-success');
                    break;
                    
                case 'quantumctl verify':
                    writeLine('Auditing Integrated Conda Environments...', 'output-info');
                    writeLine('Checking conda environments & package integrity...', 'output-muted');
                    setTimeout(() => {
                        writeLine('  [+] qiskit_env ....... v1.0.2 (Qiskit Core) ...... (VERIFIED)', 'output-success');
                        writeLine('  [+] qml_env .......... v0.35.1 (PennyLane/JAX) .... (VERIFIED)', 'output-success');
                        writeLine('  [+] quantum_crpto .... Custom (Quantum Cryptography) (VERIFIED)', 'output-success');
                        writeLine('  [+] penny_lane ....... v0.35.1 (PennyLane Core) .... (VERIFIED)', 'output-success');
                        writeLine('  [+] tfq_env .......... v0.7.3 (TensorFlow Quantum)  (VERIFIED)', 'output-success');
                        writeLine('Auditing completed: All 5 Environments mapped & verified.', 'output-success');
                    }, 400);
                    break;
                    
                case 'quantumctl doctor':
                    writeLine('Initiating Diagnostic Sequence...', 'output-warning');
                    writeLine('Testing local simulator (Aer) benchmarks...', 'output-muted');
                    setTimeout(() => {
                        writeLine('  - Check statevector simulator throughput ... [PASSED]', 'output-muted');
                        writeLine('  - Verify GCC compiler paths & symlinks ..... [PASSED]', 'output-muted');
                        writeLine('  - Check Nvidia CUDA toolkit runtime ........ [PASSED]', 'output-muted');
                        writeLine('System Diagnostics: Healthy. No errors found.', 'output-success');
                    }, 500);
                    break;
                    
                case 'quantumctl notebook':
                    writeLine('Booting JupyterLab Server...', 'output-info');
                    writeLine('Loading kernels: [Python 3, qiskit_env, qml_env, quantum_crpto, penny_lane, tfq_env]...', 'output-muted');
                    setTimeout(() => {
                        writeLine('JupyterLab Server launched successfully!', 'output-success');
                        writeLine('  Local Address: http://localhost:8888/?token=qvit_session_token_xyz', 'output-info');
                        writeLine('Press Ctrl+C inside QVIT terminal to terminate.', 'output-warning');
                    }, 600);
                    break;
                    
                case 'quantumctl qiskit':
                    writeLine('Activating Conda Environment: [qiskit_env]...', 'output-info');
                    writeLine('Setting environments and path mapping...', 'output-muted');
                    setTimeout(() => {
                        writeLine('(qiskit_env) qvit@quantum-node:~$ Qiskit Core initialized.', 'output-success');
                        writeLine('Type "python -c \'import qiskit; print(qiskit.__version__)\'" to inspect.', 'output-muted');
                    }, 300);
                    break;

                case 'quantumctl qml':
                    writeLine('Activating Conda Environment: [qml_env]...', 'output-info');
                    writeLine('Setting ML compiler optimization paths...', 'output-muted');
                    setTimeout(() => {
                        writeLine('(qml_env) qvit@quantum-node:~$ Quantum Machine Learning stack ready.', 'output-success');
                    }, 300);
                    break;

                case 'quantumctl crypto':
                    writeLine('Activating Conda Environment: [quantum_crpto]...', 'output-info');
                    writeLine('Initializing post-quantum cryptographic primitives & OpenSSH keygen...', 'output-muted');
                    setTimeout(() => {
                        writeLine('(quantum_crpto) qvit@quantum-node:~$ Crypto tools active.', 'output-success');
                    }, 300);
                    break;
                    
                case 'quantumctl pennylane':
                    writeLine('Activating Conda Environment: [penny_lane]...', 'output-info');
                    writeLine('Setting ML compiler optimization paths...', 'output-muted');
                    setTimeout(() => {
                        writeLine('(penny_lane) qvit@quantum-node:~$ PennyLane stack activated.', 'output-success');
                        writeLine('PennyLane PyTorch and JAX backends loaded.', 'output-success');
                    }, 300);
                    break;

                case 'quantumctl tfq':
                    writeLine('Activating Conda Environment: [tfq_env]...', 'output-info');
                    writeLine('Initializing TensorFlow Quantum compilation pipeline...', 'output-muted');
                    setTimeout(() => {
                        writeLine('(tfq_env) qvit@quantum-node:~$ TensorFlow Quantum ready.', 'output-success');
                    }, 300);
                    break;
                    
                default:
                    writeLine(`bash: command not found: ${cmd}`, 'output-error');
                    writeLine('Type "help" to display available QVIT controls.', 'output-muted');
            }
            
            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 150);
    }

    function writeLine(text, styleClass = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${styleClass}`;
        line.textContent = text;
        
        // Insert before interactive input line
        const inputLine = terminalBody.querySelector('.terminal-interactive-line');
        terminalBody.insertBefore(line, inputLine);
    }


    // --- MOCK DOWNLOAD ACTIONS ---
    const downloadBtns = document.querySelectorAll('.btn-dl-mock');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = btn.getAttribute('data-file');
            showToast(`Simulating Download: ${fileName}`);
        });
    });

    function showToast(message) {
        // Remove existing toast if present
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00f0ff; margin-right:10px;">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 16 14"/>
                </svg>
                <span>${message}</span>
            </div>
        `;

        // Style toast programmatically
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #00f0ff',
            boxShadow: '0 10px 30px rgba(0, 240, 255, 0.15)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            zIndex: '10000',
            animation: 'fadeIn 0.3s ease forwards',
            backdropFilter: 'blur(10px)'
        });

        document.body.appendChild(toast);

        // Fade out toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }
});

// Append CSS animation rule for fadeOut to the document dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
    }
`;
document.head.appendChild(style);
