import { Dimension, AnchorPosition } from "./Overlay";
export function applyAnchorPosition(
  anchor: HTMLDivElement,
  hostDimension: Dimension,
  hostAnchorPosition: AnchorPosition,
  contentAnchorPosition: AnchorPosition,
  options?: {
    disableTransform?: boolean;
  }
) {
  let top = 0;
  let left = 0;
  const { width: hostWidth, height: hostHeight } = hostDimension;
  const contentWidth = anchor.clientWidth;
  const contentHeight = anchor.clientHeight;
  switch (hostAnchorPosition) {
    case "top-center": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = -contentHeight;
          left = hostWidth / 2;
          break;
        }
        case "bottom-center": {
          top = -contentHeight;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = -contentHeight;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = 0;
          left = hostWidth / 2;
          break;
        }
        case "top-center": {
          top = 0;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = 0;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "center": {
          top = -(contentHeight / 2);
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = -(contentHeight / 2);
          left = hostWidth / 2;
          break;
        }
        case "right-center": {
          top = -(contentHeight / 2);
          left = hostWidth / 2 - contentWidth;
          break;
        }
      }
      break;
    }
    case "left-center": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight / 2 - contentHeight;
          left = 0;
          break;
        }
        case "bottom-center": {
          top = hostHeight / 2 - contentHeight;
          left = -contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight / 2 - contentHeight;
          left = -contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight / 2;
          left = 0;
          break;
        }
        case "top-center": {
          top = hostHeight / 2;
          left = -contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight / 2;
          left = -contentWidth;
          break;
        }
        case "center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = -contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = 0;
          break;
        }
        case "right-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = -contentWidth;
          break;
        }
      }
      break;
    }
    case "bottom-center": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight - contentHeight;
          left = hostWidth / 2;
          break;
        }
        case "bottom-center": {
          top = hostHeight - contentHeight;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight - contentHeight;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight;
          left = hostWidth / 2;
          break;
        }
        case "top-center": {
          top = hostHeight;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth / 2;
          break;
        }
        case "right-center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth / 2 - contentWidth;
          break;
        }
      }
      break;
    }
    case "right-center": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth;
          break;
        }
        case "bottom-center": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight / 2;
          left = hostWidth;
          break;
        }
        case "top-center": {
          top = hostHeight / 2;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight / 2;
          left = hostWidth - contentWidth;
          break;
        }
        case "center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth;
          break;
        }
        case "right-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth - contentWidth;
          break;
        }
      }
      break;
    }
    case "left-top":
    case "top-left": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = -contentHeight;
          left = 0;
          break;
        }
        case "bottom-center": {
          top = -contentHeight;
          left = -contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = -contentHeight;
          left = -contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = 0;
          left = 0;
          break;
        }
        case "top-center": {
          top = 0;
          left = -contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = 0;
          left = -contentWidth;
          break;
        }
        case "center": {
          top = -(contentHeight / 2);
          left = -contentWidth / 2;
          break;
        }
        case "left-center": {
          top = -(contentHeight / 2);
          left = 0;
          break;
        }
        case "right-center": {
          top = -(contentHeight / 2);
          left = -contentWidth;
          break;
        }
      }
      break;
    }
    case "right-top":
    case "top-right": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = -contentHeight;
          left = hostWidth;
          break;
        }
        case "bottom-center": {
          top = -contentHeight;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = -contentHeight;
          left = hostWidth - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = 0;
          left = hostWidth;
          break;
        }
        case "top-center": {
          top = 0;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = 0;
          left = hostWidth - contentWidth;
          break;
        }
        case "center": {
          top = -(contentHeight / 2);
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = -(contentHeight / 2);
          left = hostWidth;
          break;
        }
        case "right-center": {
          top = -(contentHeight / 2);
          left = hostWidth - contentWidth;
          break;
        }
      }
      break;
    }
    case "left-bottom":
    case "bottom-left": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight - contentHeight;
          left = 0;
          break;
        }
        case "bottom-center": {
          top = hostHeight - contentHeight;
          left = -contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight - contentHeight;
          left = -contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight;
          left = 0;
          break;
        }
        case "top-center": {
          top = hostHeight;
          left = -contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight;
          left = -contentWidth;
          break;
        }
        case "center": {
          top = hostHeight - contentHeight / 2;
          left = -contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight - contentHeight / 2;
          left = 0;
          break;
        }
        case "right-center": {
          top = hostHeight - contentHeight / 2;
          left = -contentWidth;
          break;
        }
      }
      break;
    }
    case "right-bottom":
    case "bottom-right": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight - contentHeight;
          left = hostWidth;
          break;
        }
        case "bottom-center": {
          top = hostHeight - contentHeight;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight - contentHeight;
          left = hostWidth - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight;
          left = hostWidth;
          break;
        }
        case "top-center": {
          top = hostHeight;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight;
          left = hostWidth - contentWidth;
          break;
        }
        case "center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth;
          break;
        }
        case "right-center": {
          top = hostHeight - contentHeight / 2;
          left = hostWidth - contentWidth;
          break;
        }
      }
      break;
    }
    case "center": {
      switch (contentAnchorPosition) {
        case "left-bottom":
        case "bottom-left": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth / 2;
          break;
        }
        case "bottom-center": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-bottom":
        case "bottom-right": {
          top = hostHeight / 2 - contentHeight;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "left-top":
        case "top-left": {
          top = hostHeight / 2;
          left = hostWidth / 2;
          break;
        }
        case "top-center": {
          top = hostHeight / 2;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "right-top":
        case "top-right": {
          top = hostHeight / 2;
          left = hostWidth / 2 - contentWidth;
          break;
        }
        case "center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth / 2 - contentWidth / 2;
          break;
        }
        case "left-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth / 2;
          break;
        }
        case "right-center": {
          top = hostHeight / 2 - contentHeight / 2;
          left = hostWidth / 2 - contentWidth;
          break;
        }
      }
      break;
    }
  }
  if (options && options.disableTransform) {
    anchor.style.top = `${top}px`;
    anchor.style.left = `${left}px`;
  } else {
    anchor.style.transform = `translateX(${left}px) translateY(${top}px)`;
  }
}
