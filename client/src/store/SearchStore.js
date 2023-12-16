
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: SearchStore for CapySocial2
 */

import { create } from "zustand";


const useSearchStore = create((set, get) => ({
    content: "",
    setContent: (args) => set({ content: args })
}))

export default useSearchStore;