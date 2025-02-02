// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClient } from '@mysten/dapp-kit';
import { SuiObjectDataOptions } from '@mysten/sui.js/src/client';
import { useQuery } from '@tanstack/react-query';

import { chunkArray } from '../utils/chunkArray';

export function useMultiGetObjects(
	ids: string[],
	options: SuiObjectDataOptions,
	queryOptions?: { keepPreviousData?: boolean },
) {
	const client = useSuiClient();
	return useQuery({
		queryKey: ['multiGetObjects', ids],
		queryFn: async () => {
			const responses = await Promise.all(
				chunkArray(ids, 50).map((chunk) =>
					client.multiGetObjects({
						ids: chunk,
						options,
					}),
				),
			);
			return responses.flat();
		},
		enabled: !!ids?.length,
		...queryOptions,
	});
}
