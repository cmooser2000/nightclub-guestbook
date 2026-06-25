#!/usr/bin/env python3
"""
Compress matched Bancroft archive photos and add them to guest profiles via KV API.
"""

import base64
import json
import os
import sys
from io import BytesIO
from PIL import Image
import urllib.request
import urllib.parse

IMAGES_DIR = os.path.join(os.path.dirname(__file__), '..', 'images to place')

KV_URL = os.environ.get('KV_REST_API_URL', '').rstrip('/')
KV_TOKEN = os.environ.get('KV_REST_API_TOKEN', '')

CAPTION = "From the Hattie and Minnie Mooser papers, BANC MSS 2001/28, The Bancroft Library, University of California, Berkeley."

ASSIGNMENTS = [
    {
        'guest_id': 'harry-houdini',
        'images': [
            'IMG_2324.JPG',
            'alladin studio home.jpg',
            'The_Times_Sat__Nov_6__1965_ copy.jpg',
        ],
    },
    {
        'guest_id': 'richard-bennett',
        'images': ['IMG_2338.JPG'],
    },
    {
        'guest_id': 'belle-bennett',
        'images': ['IMG_2266.JPG'],
    },
    {
        'guest_id': 'leon-errol',
        'images': ['IMG_2324.JPG'],
    },
    {
        'guest_id': 'leo-carrillo',
        'images': ['IMG_2324.JPG', 'IMG_2326.JPG'],
    },
    {
        'guest_id': 'duncan-sisters',
        'images': ['IMG_2324.JPG'],
    },
    {
        'guest_id': 'fanny-brice',
        'images': ['IMG_2326.JPG'],
    },
    {
        'guest_id': 'trixie-friganza',
        'images': ['IMG_2326.JPG'],
    },
    {
        'guest_id': 'sammy-cohen-pickings',
        'images': ['IMG_2325.JPG'],
    },
    {
        'guest_id': 'frank-mcglynn-sr',
        'images': ['IMG_2326.JPG'],
    },
    {
        'guest_id': 'oliver-morosco',
        'images': ['IMG_2336.JPG', 'IMG_2343.JPG', 'IMG_2344.JPG'],
    },
    {
        'guest_id': 'james-rolph',
        'images': ['IMG_2187.JPG', 'IMG_2222.JPG', 'IMG_2305.JPG', 'IMG_2316.JPG'],
    },
    {
        'guest_id': 'tom-moore',
        'images': ['IMG_2358.JPG'],
    },
]


def compress_image(path: str, max_width: int = 900, quality: int = 72) -> str:
    """Return a base64-encoded JPEG data URL, resized and compressed."""
    with Image.open(path) as img:
        img = img.convert('RGB')
        if img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
        buf = BytesIO()
        img.save(buf, format='JPEG', quality=quality, optimize=True)
        b64 = base64.b64encode(buf.getvalue()).decode()
        kb = len(buf.getvalue()) / 1024
        print(f'    → {os.path.basename(path)}: {kb:.0f} KB')
        return f'data:image/jpeg;base64,{b64}'


def kv_get(key: str):
    url = f'{KV_URL}/get/{urllib.parse.quote(key)}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {KV_TOKEN}'})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())['result']


def kv_set(key: str, value):
    url = f'{KV_URL}/set/{urllib.parse.quote(key)}'
    data = json.dumps(value).encode()
    req = urllib.request.Request(
        url, data=data, method='POST',
        headers={'Authorization': f'Bearer {KV_TOKEN}', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def main():
    if not KV_URL or not KV_TOKEN:
        print('ERROR: KV_REST_API_URL and KV_REST_API_TOKEN must be set')
        sys.exit(1)

    print('Fetching current guests from KV...')
    guests = kv_get('guests')
    if not guests:
        print('ERROR: no guests found in KV')
        sys.exit(1)
    # Upstash may return a double-encoded JSON string
    if isinstance(guests, str):
        guests = json.loads(guests)
    print(f'Found {len(guests)} guests')

    # Build a cache of compressed images so shared images (e.g. IMG_2324) are only
    # compressed once.
    image_cache: dict[str, str] = {}

    for assignment in ASSIGNMENTS:
        gid = assignment['guest_id']
        guest = next((g for g in guests if g['id'] == gid), None)
        if not guest:
            print(f'SKIP: guest {gid} not found')
            continue

        print(f'\n{gid} ({guest["name"]})')
        existing = guest.get('additionalImages', [])
        # Normalise legacy string entries
        existing = [
            img if isinstance(img, dict) else {'url': img, 'caption': ''}
            for img in existing
        ]

        for fname in assignment['images']:
            fpath = os.path.join(IMAGES_DIR, fname)
            if not os.path.exists(fpath):
                print(f'  MISSING: {fpath}')
                continue
            if fname not in image_cache:
                image_cache[fname] = compress_image(fpath)
            url = image_cache[fname]
            existing.append({'url': url, 'caption': CAPTION})

        guest['additionalImages'] = existing

    print('\nSaving updated guests to KV...')
    result = kv_set('guests', guests)
    print(f'KV response: {result}')
    print('Done.')


if __name__ == '__main__':
    main()
