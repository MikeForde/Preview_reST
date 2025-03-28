#!/usr/bin/env python3
import sys
from docutils.core import publish_string

def main():
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: rst2html_converter.py <rst_file>\n")
        sys.exit(1)

    rst_file = sys.argv[1]

    try:
        with open(rst_file, "r", encoding="utf-8") as f:
            rst_content = f.read()
    except Exception as e:
        sys.stderr.write(f"Error reading file {rst_file}: {e}\n")
        sys.exit(1)

    try:
        # Convert reST to HTML using publish_string.
        html_output = publish_string(source=rst_content,
                                       writer_name='html',
                                       settings_overrides={'no_system_messages': True})
        # publish_string returns a byte string, so decode it.
        sys.stdout.write(html_output.decode('utf-8'))
    except Exception as e:
        sys.stderr.write(f"Error converting file: {e}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
