#!/usr/bin/env python3
"""
Profile Manager for Claude Jobseeking Plugin
Handles secure storage and retrieval of user profile data
"""

import json
import os
import base64
from cryptography.fernet import Fernet
from pathlib import Path
import hashlib
import sys

# Import workspace manager
try:
    from workspace_manager import JobseekingWorkspaceManager
except ImportError:
    # Handle when running from different directory
    sys.path.append(os.path.dirname(__file__))
    from workspace_manager import JobseekingWorkspaceManager

class ProfileManager:
    def __init__(self, profile_dir=None, workspace_path=None):
        """Initialize profile manager with secure storage directory"""
        self.profile_dir = profile_dir or os.path.expanduser('~/.claude-jobseeking')
        Path(self.profile_dir).mkdir(exist_ok=True)
        self.profile_file = os.path.join(self.profile_dir, 'user_profile.enc')
        self.key_file = os.path.join(self.profile_dir, 'profile.key')

        # Initialize workspace manager
        self.workspace_manager = JobseekingWorkspaceManager(workspace_path)

    def _get_encryption_key(self):
        """Get or create encryption key for profile data"""
        if os.path.exists(self.key_file):
            with open(self.key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as f:
                f.write(key)
            os.chmod(self.key_file, 0o600)  # Read-only for owner
            return key

    def save_profile(self, profile_data):
        """Save user profile with encryption"""
        try:
            # Validate profile structure
            self._validate_profile(profile_data)

            # Encrypt and save
            key = self._get_encryption_key()
            cipher = Fernet(key)

            profile_json = json.dumps(profile_data, indent=2)
            encrypted_data = cipher.encrypt(profile_json.encode())

            with open(self.profile_file, 'wb') as f:
                f.write(encrypted_data)

            os.chmod(self.profile_file, 0o600)  # Read-only for owner

            print(f"Profile saved successfully to {self.profile_file}")
            return True

        except Exception as e:
            print(f"Error saving profile: {str(e)}")
            return False

    def load_profile(self):
        """Load and decrypt user profile"""
        try:
            if not os.path.exists(self.profile_file):
                return None

            key = self._get_encryption_key()
            cipher = Fernet(key)

            with open(self.profile_file, 'rb') as f:
                encrypted_data = f.read()

            decrypted_data = cipher.decrypt(encrypted_data)
            profile_data = json.loads(decrypted_data.decode())

            return profile_data

        except Exception as e:
            print(f"Error loading profile: {str(e)}")
            return None

    def update_profile_section(self, section, data):
        """Update specific section of profile"""
        profile = self.load_profile() or self._get_empty_profile()
        profile[section] = data
        return self.save_profile(profile)

    def get_profile_completeness(self):
        """Calculate profile completeness percentage"""
        profile = self.load_profile()
        if not profile:
            return 0

        weights = {
            'personal': 15,
            'professional': 20,
            'experience': 25,
            'skills': 15,
            'education': 10,
            'preferences': 15
        }

        total_score = 0
        for section, weight in weights.items():
            if section in profile and profile[section]:
                section_completeness = self._calculate_section_completeness(section, profile[section])
                total_score += (section_completeness * weight / 100)

        return min(100, total_score)

    def _calculate_section_completeness(self, section, data):
        """Calculate completeness for a specific section"""
        if section == 'personal':
            required_fields = ['name', 'email', 'phone', 'location']
            filled = sum(1 for field in required_fields if data.get(field))
            return (filled / len(required_fields)) * 100

        elif section == 'professional':
            required_fields = ['title', 'summary', 'yearsExperience']
            filled = sum(1 for field in required_fields if data.get(field))
            return (filled / len(required_fields)) * 100

        elif section == 'experience':
            return 100 if data and len(data) > 0 else 0

        elif section == 'skills':
            return 100 if data and len(data) > 0 else 0

        elif section == 'education':
            return 100 if data and len(data) > 0 else 0

        elif section == 'preferences':
            required_fields = ['targetRoles', 'salaryRange']
            filled = sum(1 for field in required_fields if data.get(field))
            return (filled / len(required_fields)) * 100

        return 0

    def _validate_profile(self, profile_data):
        """Validate profile data structure"""
        required_sections = ['personal', 'professional', 'experience', 'education', 'preferences', 'settings']
        for section in required_sections:
            if section not in profile_data:
                profile_data[section] = {}
        return True

    def _get_empty_profile(self):
        """Get empty profile template"""
        return {
            "personal": {},
            "professional": {},
            "experience": [],
            "skills": [],
            "education": [],
            "preferences": {},
            "settings": {
                "coverLetterStyle": "professional",
                "resumeFormat": "modern",
                "followUpCadence": "weekly"
            },
            "metadata": {
                "created": "",
                "lastUpdated": "",
                "version": "1.0"
            }
        }

    def export_profile(self, output_file):
        """Export profile to JSON file"""
        profile = self.load_profile()
        if profile:
            with open(output_file, 'w') as f:
                json.dump(profile, f, indent=2)
            print(f"Profile exported to {output_file}")
            return True
        return False

    def delete_profile(self):
        """Delete profile data (with confirmation)"""
        try:
            if os.path.exists(self.profile_file):
                os.remove(self.profile_file)
            if os.path.exists(self.key_file):
                os.remove(self.key_file)
            print("Profile data deleted successfully")
            return True
        except Exception as e:
            print(f"Error deleting profile: {str(e)}")
            return False

    def setup_workspace(self, user_name=None, workspace_path=None, overwrite=False):
        """Create jobseeking workspace structure"""
        if workspace_path:
            self.workspace_manager = JobseekingWorkspaceManager(workspace_path)

        try:
            success = self.workspace_manager.create_workspace(user_name, overwrite)
            if success:
                # Update profile with workspace path
                profile = self.load_profile() or self._get_empty_profile()
                profile['metadata']['workspace_path'] = str(self.workspace_manager.base_path)
                profile['metadata']['workspace_created'] = True
                self.save_profile(profile)

            return success
        except Exception as e:
            print(f"Error setting up workspace: {str(e)}")
            return False

    def get_workspace_info(self):
        """Get workspace information and status"""
        profile = self.load_profile()
        if not profile:
            return None

        workspace_path = profile.get('metadata', {}).get('workspace_path')
        if not workspace_path:
            return {'exists': False, 'path': None}

        workspace_path = Path(workspace_path)
        exists = workspace_path.exists()

        info = {
            'exists': exists,
            'path': str(workspace_path),
            'created': profile.get('metadata', {}).get('workspace_created', False)
        }

        if exists:
            try:
                # Count files and directories
                all_files = list(workspace_path.rglob("*"))
                directories = [f for f in all_files if f.is_dir()]
                files = [f for f in all_files if f.is_file()]

                info.update({
                    'total_directories': len(directories),
                    'total_files': len(files),
                    'size_mb': sum(f.stat().st_size for f in files) / (1024 * 1024)
                })

                # Check for key directories
                key_dirs = ['Resume_and_Core', 'Projects', 'Role_Applications', 'Role_References']
                info['key_directories'] = {
                    dir_name: (workspace_path / dir_name).exists()
                    for dir_name in key_dirs
                }

            except Exception as e:
                info['error'] = f"Error reading workspace: {str(e)}"

        return info

# CLI interface for testing
if __name__ == "__main__":
    import sys

    manager = ProfileManager()

    if len(sys.argv) < 2:
        print("Usage: python profile_manager.py [load|save|completeness|export|delete|workspace|workspace-info]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "load":
        profile = manager.load_profile()
        if profile:
            print(json.dumps(profile, indent=2))
        else:
            print("No profile found")

    elif command == "completeness":
        score = manager.get_profile_completeness()
        print(f"Profile completeness: {score:.1f}%")

    elif command == "export":
        output_file = sys.argv[2] if len(sys.argv) > 2 else "profile_export.json"
        manager.export_profile(output_file)

    elif command == "delete":
        confirm = input("Are you sure you want to delete your profile? (yes/no): ")
        if confirm.lower() == 'yes':
            manager.delete_profile()

    elif command == "workspace":
        workspace_path = sys.argv[2] if len(sys.argv) > 2 else None
        user_name = sys.argv[3] if len(sys.argv) > 3 else None
        overwrite = "--overwrite" in sys.argv

        success = manager.setup_workspace(user_name, workspace_path, overwrite)
        if success:
            print("✅ Workspace created successfully!")
            info = manager.get_workspace_info()
            if info:
                print(f"📁 Location: {info['path']}")
                print(f"📊 Directories: {info.get('total_directories', 0)}")
                print(f"📄 Files: {info.get('total_files', 0)}")
        else:
            print("❌ Workspace creation failed")

    elif command == "workspace-info":
        info = manager.get_workspace_info()
        if info:
            print(json.dumps(info, indent=2))
        else:
            print("No profile found")

    else:
        print(f"Unknown command: {command}")