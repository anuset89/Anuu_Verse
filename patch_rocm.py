import os
import struct

def clear_execstack(filepath):
    """
    Clears the executable stack flag in the ELF header.
    Equivalent to `execstack -c filepath`.
    """
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    try:
        with open(filepath, 'r+b') as f:
            # Read ELF header
            # e_phoff is at offset 0x20 (64-bit)
            f.seek(0x20)
            e_phoff = struct.unpack('<Q', f.read(8))[0]
            
            # e_phnum is at offset 0x38 (64-bit)
            f.seek(0x38)
            e_phnum = struct.unpack('<H', f.read(2))[0]
            
            # Use e_phentsize default usually 56 bytes (0x38)
            f.seek(0x36)
            e_phentsize = struct.unpack('<H', f.read(2))[0]

            print(f"Target: {filepath}")
            print(f"Program headers: {e_phnum} at offset {e_phoff}")
            
            patched = False
            
            for i in range(e_phnum):
                offset = e_phoff + (i * e_phentsize)
                f.seek(offset)
                
                # Check p_type (4 bytes)
                p_type = struct.unpack('<I', f.read(4))[0]
                
                # PT_GNU_STACK is 0x6474e551
                if p_type == 0x6474e551:
                    print(f"Found PT_GNU_STACK at segment {i}")
                    
                    # p_flags is at offset +4 (4 bytes) 
                    # flags: 1=X, 2=W, 4=R. We want to clear X (1).
                    f.seek(offset + 4)
                    p_flags = struct.unpack('<I', f.read(4))[0]
                    
                    if p_flags & 1:
                        print("Stack is executable (RWX). Clearing Executable bit...")
                        new_flags = p_flags & ~1
                        f.seek(offset + 4)
                        f.write(struct.pack('<I', new_flags))
                        patched = True
                    else:
                        print("Stack is already non-executable.")
            
            if patched:
                print("Successfully patched.")
            else:
                print("No executable stack header found or no patch needed.")

    except Exception as e:
        print(f"Error patching {filepath}: {e}")

def recursive_patch(directory):
    print(f"Scanning {directory}...")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".so") or ".so." in file:
                fullpath = os.path.join(root, file)
                clear_execstack(fullpath)

site_packages = "/home/kali/Anuu_Verse/.venv-full/lib/python3.11/site-packages"
targets = [
    os.path.join(site_packages, "torch"),
    os.path.join(site_packages, "triton"),
    os.path.join(site_packages, "functorch"),
    os.path.join(site_packages, "torchvision"),
    os.path.join(site_packages, "torchaudio") 
]

for t in targets:
    if os.path.exists(t):
        recursive_patch(t)
