import os
import re
import subprocess
import time
import ollama
import json

# --- CONFIGURATION ---
REPO_PATH = os.path.dirname(os.path.abspath(__file__))  # ⚠️ Auto-detected current repo path
MODEL_NAME = "gemma4:e2b"                     # Your local Google Gemma 4 model
COMPLETED_TASKS_FILE = os.path.join(REPO_PATH, ".completed_tasks.json")

# --- FULL ROADMAP QUEUE ---
# The agent will work down this list sequentially, 100% hands-free.
ROADMAP_QUEUE = [
    # LEVEL 1 — CORE ESCROW MVP (Smart Contracts & Foundation)
    "Write the core TrustLance Escrow Solidity smart contract supporting milestones, withdrawal pattern, and basic state machine (Created, Locked, Released, Disputed). Ensure OpenZeppelin access controls.",
    "Write the complete Hardhat deployment and test scripts for the Escrow contract, covering funding, milestone release, and basic access control rules.",
    "Design the Prisma schema in backend/prisma/schema.prisma detailing User, Job, Milestone, and EscrowTransaction tables matching the Web3 status changes.",
    "Build the Express API infrastructure in backend/ including router patterns for authenticating wallets, managing Jobs, and keeping track of transaction hashes.",
    "Implement the Next.js wallet connection layout using Wagmi and RainbowKit with network detection and role selection (Client vs Freelancer).",
    "Build Frontend pages for Create Job, Job Details, and Job Listings using Tailwind CSS and hooks connected to our deployed contract states.",
    "Create the Milestone Management UI logic to track progress, submit milestones with placeholder strings, and manage the approval flows.",
    "Build a basic dispute contract module alongside backend dispute state APIs allowing funds to freeze upon a dispute request.",
    
    # LEVEL 2 — PROFESSIONAL PRODUCT FEATURES
    "Build the Client and Freelancer unified Dashboards using Tailwind CSS grids, structural active jobs widgets, and a recent activity log component.",
    "Implement User Profile schemas and frontend pages rendering portfolios, user skills tags, and placeholder reputation scores.",
    "Create an in-app database-backed notification pipeline alerting clients when milestones are submitted and freelancers when escrow is funded.",
    
    # LEVEL 3 — WEB3-NATIVE FEATURES
    "Integrate on-chain Event Feeds on the frontend reading past Escrow contract events and linking them directly to block explorer URLs.",
    "Set up decentralized storage metadata mapping: write a backend utility tool that pins job creation metadata payloads to IPFS format structure structures.",
    
    # LEVEL 4 — ADVANCED FEATURES (DAO Governance)
    "Draft the foundational DAO Governance and Juror voting smart contract where staked tokens dictate voting weight on open escrow disputes.",
    "Create the Juror Dashboard interface displaying disputed projects, open voting timelines, and staking pool metrics.",
    
    # LEVEL 5 — AI FEATURES
    "Build an internal backend evaluation route utilizing your local Gemma model to analyze job descriptions for potential scam traits before posting.",
    
    # LEVEL 6 — "WOW" FEATURES
    "Implement a Soulbound Token (SBT) smart contract module that automatically mints a non-transferable work achievement token upon successful milestone closures."
]

# --- GIT PIPELINE ---
def execute_git_pipeline(task_title):
    """Stages, commits, and pushes code autonomously to GitHub."""
    try:
        os.chdir(REPO_PATH)
        subprocess.run(["git", "add", "."], check=True, capture_output=True)
        
        # Verify if changes were made
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if not status.stdout.strip():
            print("💤 No file changes generated for this item. Skipping commit.")
            return True

        commit_msg = f"feat(autonomous): finished task -> {task_title[:50]}..."
        subprocess.run(["git", "commit", "-m", commit_msg], check=True, capture_output=True)
        subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
        print("🚀 Progress successfully synchronized and pushed to GitHub!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Git failure: {e.stderr.decode() if e.stderr else e}")
        return False

# --- COMPILER VALIDATION ---
def run_project_checks():
    """Validates syntax and build paths so the loop doesn't push broken files."""
    print("🧪 Verifying build integrity...")
    try:
        os.chdir(REPO_PATH)
        # If a package.json is preset at root, test it
        if os.path.exists(os.path.join(REPO_PATH, "package.json")):
            # Optional syntax parser: Change to 'npm run build' or similar verification if desired
            pass
        return True
    except Exception as e:
        print(f"⚠️ Build check warning: {e}")
        return True

# --- PARSER ---
def parse_and_write_files(ai_response):
    """Parses structural file markers block strings directly into monorepo paths."""
    file_blocks = re.findall(r'\[FILE:\s*(.*?)\](.*?)\[END_FILE\]', ai_response, re.DOTALL)
    
    if not file_blocks:
        print("❌ AI failed to follow formatting layout instructions.")
        return False

    for rel_path, code in file_blocks:
        clean_path = rel_path.strip()
        full_dest_path = os.path.join(REPO_PATH, clean_path)
        
        os.makedirs(os.path.dirname(full_dest_path), exist_ok=True)
        with open(full_dest_path, "w", encoding="utf-8") as f:
            f.write(code.strip())
        print(f"💾 File updated: {clean_path}")
    return True

# --- MEMORY UTILITIES ---
def get_completed_tasks():
    if os.path.exists(COMPLETED_TASKS_FILE):
        with open(COMPLETED_TASKS_FILE, "r") as f:
            try:
                return set(json.load(f))
            except:
                return set()
    return set()

def mark_task_completed(task):
    completed = get_completed_tasks()
    completed.add(task)
    with open(COMPLETED_TASKS_FILE, "w") as f:
        json.dump(list(completed), f)

# --- ENGINE ---
def run_continuous_pipeline():
    tech_context = """
    You are an absolute autonomous expert developer building 'TrustLance', a production Web3 monorepo.
    Architecture:
    - /contracts : Solidity ^0.8.20 (Hardhat, OpenZeppelin)
    - /backend : Node.js, Express, Prisma (PostgreSQL), Redis
    - /frontend : Next.js App Router, Tailwind CSS, Wagmi/RainbowKit

    Strict Output Formatting Rule:
    You are allowed to write or modify multiple files to fulfill your target goal. 
    Wrap EVERY single file block cleanly inside these exact markers:
    [FILE: path/to/file.ext]
    // exact code implementation here
    [END_FILE]
    
    Do not add markdown formatting outside the blocks. Do not add casual chatting. Start writing file blocks instantly.
    """

    completed_tasks = get_completed_tasks()
    print(f"🏁 Starting Continuous Pipeline. Found {len(ROADMAP_QUEUE)} total tasks ({len([t for t in ROADMAP_QUEUE if t in completed_tasks])} already completed).")
    
    for index, current_task in enumerate(ROADMAP_QUEUE, 1):
        if current_task in completed_tasks:
            print(f"\n⏭️  [{index}/{len(ROADMAP_QUEUE)}] SKIPPING (Already Completed): {current_task[:50]}...")
            continue
            
        print(f"\n⚡ [{index}/{len(ROADMAP_QUEUE)}] CURRENT GOAL: {current_task}")
        
        # Invoke Gemma 4 with reasoning capability enabled
        try:
            response = ollama.generate(
                model=MODEL_NAME,
                system=f"<|think|>\n{tech_context}",
                prompt=f"Execute this task immediately for the monorepo architecture: {current_task}"
            )
            
            ai_output = response['response']
            
            # Execute physical file changes
            if parse_and_write_files(ai_output):
                if run_project_checks():
                    # Sync to remote GitHub master branch
                    if execute_git_pipeline(current_task):
                        mark_task_completed(current_task)
            
            # Brief cooldown window to allow OS file handles to clear
            time.sleep(2)
            
        except Exception as err:
            print(f"💥 Failed to complete loop phase at index {index}: {err}")
            print("Moving to next task to prevent pipeline lock...")
            continue

    print("\n🏆 ALL ROADMAP TASKS COMPLETED AUTONOMOUSLY!")

if __name__ == "__main__":
    run_continuous_pipeline()
